import fs from 'fs';

import addMessage from '../src/app/actions/addMessage';
import { handleUploadVideo } from '../src/lib/cloudinary';
import prisma from '../src/lib/prisma';
import { validateMessageInput } from '../src/schemas/validation/addMessageValidation';
import { formatError } from '../src/utils/errorUtils';
import { handleTriggerNewMessageEvent } from '../src/utils/pusherUtils';

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    message: {
      create: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../src/lib/cloudinary', () => ({
  __esModule: true,
  handleUploadVideo: jest.fn(),
}));

jest.mock('../src/utils/pusherUtils', () => ({
  __esModule: true,
  handleTriggerNewMessageEvent: jest.fn(),
}));

jest.mock('../src/schemas/validation/addMessageValidation', () => ({
  __esModule: true,
  validateMessageInput: jest.fn(),
}));

jest.mock('../src/utils/errorUtils', () => ({
  __esModule: true,
  formatError: jest.fn(),
}));

const mockedPrisma = prisma;
const mockedHandleUploadVideo = handleUploadVideo as jest.Mock;
const mockedHandleTriggerNewMessageEvent =
  handleTriggerNewMessageEvent as jest.Mock;
const mockedValidateMessageInput = validateMessageInput as jest.Mock;
const mockedFormatError = formatError as jest.Mock;
const mockedFs = fs as jest.Mocked<typeof fs>;

const ContentKey = 'content';
const SenderIdKey = 'senderId';
const RecipientIdKey = 'recipientId';
const VideoFileKey = 'videoFile';
const VideoPath = '/tmp/video.mp4';
const VideoUrl = 'https://cloudinary.com/video.mp4';
const VideoPublicId = 'public_id_video';
const ValidMessage = 'Hello, world!';
const ValidVideoMessage = 'Hello, with video!';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AddMessage Functionality Tests', () => {
  it('should create a message successfully when valid input is provided without video', async () => {
    const mockedUserFindUnique = mockedPrisma.user.findUnique as jest.Mock;
    const mockedMessageCreate = mockedPrisma.message.create as jest.Mock;

    mockedValidateMessageInput.mockReturnValue({
      success: true,
      data: {
        content: ValidMessage,
        senderId: 1,
        recipientId: 2,
      },
    });

    mockedUserFindUnique.mockResolvedValue({
      id: 1,
      username: 'senderUsername',
    });

    mockedMessageCreate.mockResolvedValue({
      id: 1,
      content: ValidMessage,
      senderId: 1,
      recipientId: 2,
      videoUrl: null,
      videoPublicId: null,
      createdAt: new Date(),
    });

    mockedHandleTriggerNewMessageEvent.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.append(ContentKey, ValidMessage);
    formData.append(SenderIdKey, '1');
    formData.append(RecipientIdKey, '2');

    const result = await addMessage(undefined, formData);

    expect(result).toEqual({ success: true, videoUrl: null });

    expect(mockedValidateMessageInput).toHaveBeenCalledWith(formData);
    expect(mockedUserFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockedMessageCreate).toHaveBeenCalledWith({
      data: {
        content: ValidMessage,
        senderId: 1,
        recipientId: 2,
        videoUrl: null,
        videoPublicId: null,
      },
    });
    expect(mockedHandleTriggerNewMessageEvent).toHaveBeenCalled();
  });

  it('should create a message successfully when valid input is provided with a video', async () => {
    const mockedUserFindUnique = mockedPrisma.user.findUnique as jest.Mock;
    const mockedMessageCreate = mockedPrisma.message.create as jest.Mock;

    mockedValidateMessageInput.mockReturnValue({
      success: true,
      data: {
        content: ValidVideoMessage,
        senderId: 1,
        recipientId: 2,
      },
    });

    const videoFile = {
      name: 'video.mp4',
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(10)),
    };

    const formData = {
      get: jest.fn((key) => {
        if (key === VideoFileKey) return videoFile;
        if (key === ContentKey) return ValidVideoMessage;
        if (key === SenderIdKey) return '1';
        if (key === RecipientIdKey) return '2';
        return null;
      }),
      has: jest.fn((key) =>
        [VideoFileKey, ContentKey, SenderIdKey, RecipientIdKey].includes(key)
      ),
    } as unknown as FormData;

    mockedFs.writeFileSync.mockImplementation(() => {});
    mockedFs.unlinkSync.mockImplementation(() => {});

    mockedHandleUploadVideo.mockResolvedValue({
      url: VideoUrl,
      publicId: VideoPublicId,
    });

    mockedUserFindUnique.mockResolvedValue({
      id: 1,
      username: 'senderUsername',
    });

    mockedMessageCreate.mockResolvedValue({
      id: 1,
      content: ValidVideoMessage,
      senderId: 1,
      recipientId: 2,
      videoUrl: VideoUrl,
      videoPublicId: VideoPublicId,
      createdAt: new Date(),
    });

    mockedHandleTriggerNewMessageEvent.mockResolvedValue(undefined);

    const result = await addMessage(undefined, formData);

    expect(result).toEqual({
      success: true,
      videoUrl: VideoUrl,
    });

    expect(mockedValidateMessageInput).toHaveBeenCalledWith(formData);
    expect(videoFile.arrayBuffer).toHaveBeenCalled();
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      VideoPath,
      expect.any(Buffer)
    );
    expect(mockedHandleUploadVideo).toHaveBeenCalledWith(VideoPath);
    expect(mockedFs.unlinkSync).toHaveBeenCalledWith(VideoPath);
    expect(mockedUserFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockedMessageCreate).toHaveBeenCalledWith({
      data: {
        content: ValidVideoMessage,
        senderId: 1,
        recipientId: 2,
        videoUrl: VideoUrl,
        videoPublicId: VideoPublicId,
      },
    });
    expect(mockedHandleTriggerNewMessageEvent).toHaveBeenCalled();
  });

  it('should return validation errors when input is invalid', async () => {
    mockedValidateMessageInput.mockReturnValue({
      success: false,
      error: {
        issues: [
          {
            message: 'Content is required',
            path: [ContentKey],
            code: 'invalid_type',
          },
        ],
      },
    });

    const formData = new FormData();

    const result = await addMessage(undefined, formData);

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: 'Content is required',
          path: [ContentKey],
          code: 'invalid_type',
        },
      ],
    });

    expect(mockedValidateMessageInput).toHaveBeenCalledWith(formData);
    expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockedPrisma.message.create).not.toHaveBeenCalled();
    expect(mockedHandleUploadVideo).not.toHaveBeenCalled();
  });

  it('should return an error when video upload fails', async () => {
    mockedValidateMessageInput.mockReturnValue({
      success: true,
      data: {
        content: ValidVideoMessage,
        senderId: 1,
        recipientId: 2,
      },
    });

    const videoFile = {
      name: 'video.mp4',
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(10)),
    };

    const formData = {
      get: jest.fn((key) => (key === VideoFileKey ? videoFile : null)),
      has: jest.fn((key) => key === VideoFileKey),
    } as unknown as FormData;

    const uploadError = new Error('Upload failed');
    mockedHandleUploadVideo.mockRejectedValue(uploadError);

    mockedFormatError.mockReturnValue({
      success: false,
      errors: [
        {
          message: 'Error uploading video.',
          path: ['upload'],
          code: 'custom',
        },
      ],
    });

    const result = await addMessage(undefined, formData);

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: 'Error uploading video.',
          path: ['upload'],
          code: 'custom',
        },
      ],
    });

    expect(mockedValidateMessageInput).toHaveBeenCalledWith(formData);
    expect(mockedHandleUploadVideo).toHaveBeenCalled();
    expect(mockedFs.writeFileSync).toHaveBeenCalled();
    expect(mockedFs.unlinkSync).toHaveBeenCalled();
    expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockedPrisma.message.create).not.toHaveBeenCalled();
    expect(mockedHandleTriggerNewMessageEvent).not.toHaveBeenCalled();
  });
});
