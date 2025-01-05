import addMessage from '../src/app/actions/addMessage';
import {
  createMessage,
  getSenderById,
} from '../src/lib/services/createChatService';
import { validateMessageInput } from '../src/schemas/validation/addMessageValidation';
import { errorSendingMessage } from '../src/strings/actionStrings';
import { formatError } from '../src/utils/errorUtils';
import { handleTriggerNewMessageEvent } from '../src/utils/pusherUtils';

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

jest.mock('../src/lib/services/createChatService', () => ({
  __esModule: true,
  createMessage: jest.fn(),
  getSenderById: jest.fn(),
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

const mockedCreateMessage = createMessage as jest.Mock;
const mockedGetSenderById = getSenderById as jest.Mock;
const mockedHandleTriggerNewMessageEvent =
  handleTriggerNewMessageEvent as jest.Mock;
const mockedValidateMessageInput = validateMessageInput as jest.Mock;
const mockedFormatError = formatError as jest.Mock;

const ContentKey = 'content';
const SenderIdKey = 'senderId';
const RecipientIdKey = 'recipientId';
const VideoUrl = 'https://cloudinary.com/video.mp4';
const VideoPublicId = 'public_id_video';
const ValidMessage = 'Hello, world!';
const ValidVideoMessage = 'Hello, with video!';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AddMessage Functionality Tests', () => {
  it('should create a message successfully when valid input is provided without video', async () => {
    mockedValidateMessageInput.mockReturnValue({
      success: true,
      data: {
        content: ValidMessage,
        senderId: 1,
        recipientId: 2,
      },
    });

    mockedCreateMessage.mockResolvedValue({
      id: 1,
      content: ValidMessage,
      senderId: 1,
      recipientId: 2,
      videoUrl: undefined,
      videoPublicId: undefined,
      createdAt: new Date(),
    });

    mockedGetSenderById.mockResolvedValue({
      id: 1,
      username: 'senderUsername',
    });

    mockedHandleTriggerNewMessageEvent.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.append(ContentKey, ValidMessage);
    formData.append(SenderIdKey, '1');
    formData.append(RecipientIdKey, '2');

    const result = await addMessage(undefined, formData);

    expect(result).toEqual({ success: true, videoUrl: undefined });

    expect(mockedValidateMessageInput).toHaveBeenCalledWith(formData);
    expect(mockedCreateMessage).toHaveBeenCalledWith({
      content: ValidMessage,
      senderId: 1,
      recipientId: 2,
      videoUrl: undefined,
      videoPublicId: undefined,
    });
    expect(mockedGetSenderById).toHaveBeenCalledWith(1);
    expect(mockedHandleTriggerNewMessageEvent).toHaveBeenCalled();
  });

  it('should create a message successfully when valid input is provided with a video', async () => {
    mockedValidateMessageInput.mockReturnValue({
      success: true,
      data: {
        content: ValidVideoMessage,
        senderId: 1,
        recipientId: 2,
        videoUrl: VideoUrl,
        videoPublicId: VideoPublicId,
      },
    });

    mockedCreateMessage.mockResolvedValue({
      id: 1,
      content: ValidVideoMessage,
      senderId: 1,
      recipientId: 2,
      videoUrl: VideoUrl,
      videoPublicId: VideoPublicId,
      createdAt: new Date(),
    });

    mockedGetSenderById.mockResolvedValue({
      id: 1,
      username: 'senderUsername',
    });

    mockedHandleTriggerNewMessageEvent.mockResolvedValue(undefined);

    const formData = new FormData();
    formData.append(ContentKey, ValidVideoMessage);
    formData.append(SenderIdKey, '1');
    formData.append(RecipientIdKey, '2');

    const result = await addMessage(undefined, formData);

    expect(result).toEqual({ success: true, videoUrl: VideoUrl });

    expect(mockedValidateMessageInput).toHaveBeenCalledWith(formData);
    expect(mockedCreateMessage).toHaveBeenCalledWith({
      content: ValidVideoMessage,
      senderId: 1,
      recipientId: 2,
      videoUrl: VideoUrl,
      videoPublicId: VideoPublicId,
    });
    expect(mockedGetSenderById).toHaveBeenCalledWith(1);
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
    expect(mockedCreateMessage).not.toHaveBeenCalled();
    expect(mockedGetSenderById).not.toHaveBeenCalled();
    expect(mockedHandleTriggerNewMessageEvent).not.toHaveBeenCalled();
  });

  it('should return an error when message creation fails', async () => {
    mockedValidateMessageInput.mockReturnValue({
      success: true,
      data: {
        content: ValidMessage,
        senderId: 1,
        recipientId: 2,
      },
    });

    const creationError = new Error('Message creation failed');
    mockedCreateMessage.mockRejectedValue(creationError);

    mockedFormatError.mockReturnValue({
      success: false,
      errors: [
        {
          message: errorSendingMessage,
          path: ['form'],
          code: 'custom',
        },
      ],
    });

    const formData = new FormData();
    formData.append(ContentKey, ValidMessage);
    formData.append(SenderIdKey, '1');
    formData.append(RecipientIdKey, '2');

    const result = await addMessage(undefined, formData);

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: errorSendingMessage,
          path: ['form'],
          code: 'custom',
        },
      ],
    });

    expect(mockedValidateMessageInput).toHaveBeenCalledWith(formData);
    expect(mockedCreateMessage).toHaveBeenCalled();
    expect(mockedGetSenderById).not.toHaveBeenCalled();
    expect(mockedHandleTriggerNewMessageEvent).not.toHaveBeenCalled();
  });
});
