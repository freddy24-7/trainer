import prisma from '@/lib/prisma';
import { deleteVideoFromCloudinary } from '@/utils/cloudinaryUtils';
import { formatError } from '@/utils/errorUtils';

import { deleteMessage } from '../src/app/actions/deleteMessage';

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    message: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      destroy: jest.fn(),
    },
  },
}));

jest.mock('../src/utils/cloudinaryUtils', () => ({
  __esModule: true,
  deleteVideoFromCloudinary: jest.fn(),
}));

jest.mock('../src/utils/errorUtils', () => ({
  __esModule: true,
  formatError: jest.fn(),
}));

process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'test_cloud_name';
process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY = 'test_api_key';
process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET = 'test_api_secret';

const mockedFindUnique = prisma.message.findUnique as jest.Mock;
const mockedDelete = prisma.message.delete as jest.Mock;
const mockedDeleteVideoFromCloudinary = deleteVideoFromCloudinary as jest.Mock;
const mockedFormatError = formatError as jest.Mock;

const verifySuccessfulDeletion = async (
  videoPublicId: string | null = null
): Promise<void> => {
  const result = await deleteMessage(1, 1);

  expect(result).toEqual({ success: true });
  expect(mockedFindUnique).toHaveBeenCalledWith({
    where: { id: 1 },
  });
  expect(mockedDelete).toHaveBeenCalledWith({
    where: { id: 1 },
  });

  if (videoPublicId) {
    expect(mockedDeleteVideoFromCloudinary).toHaveBeenCalledWith(videoPublicId);
  } else {
    expect(mockedDeleteVideoFromCloudinary).not.toHaveBeenCalled();
  }
};

describe('deleteMessage Functionality Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the message successfully when conditions are met', async () => {
    mockedFindUnique.mockResolvedValue({
      id: 1,
      senderId: 1,
      videoPublicId: null,
    });

    mockedDelete.mockResolvedValue({});

    await verifySuccessfulDeletion();
  });

  it('should delete the message and associated video when it has a videoPublicId', async () => {
    mockedFindUnique.mockResolvedValue({
      id: 1,
      senderId: 1,
      videoPublicId: 'video_public_id',
    });

    mockedDelete.mockResolvedValue({});
    mockedDeleteVideoFromCloudinary.mockResolvedValue(undefined);

    await verifySuccessfulDeletion('video_public_id');
  });

  it('should return an error if the message does not exist', async () => {
    mockedFindUnique.mockResolvedValue(null);
    mockedFormatError.mockReturnValue({
      success: false,
      errors: [{ message: 'Message not found.', path: ['delete'] }],
    });

    const result = await deleteMessage(1, 1);

    expect(result).toEqual({
      success: false,
      errors: [{ message: 'Message not found.', path: ['delete'] }],
    });
    expect(mockedFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockedDelete).not.toHaveBeenCalled();
    expect(mockedDeleteVideoFromCloudinary).not.toHaveBeenCalled();
  });

  it('should return an error if the user is not authorized to delete the message', async () => {
    mockedFindUnique.mockResolvedValue({
      id: 1,
      senderId: 2,
      videoPublicId: null,
    });
    mockedFormatError.mockReturnValue({
      success: false,
      errors: [
        {
          message: 'Unauthorized to delete this message.',
          path: ['authorization'],
        },
      ],
    });

    const result = await deleteMessage(1, 1);

    expect(result).toEqual({
      success: false,
      errors: [
        {
          message: 'Unauthorized to delete this message.',
          path: ['authorization'],
        },
      ],
    });
    expect(mockedFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockedDelete).not.toHaveBeenCalled();
    expect(mockedDeleteVideoFromCloudinary).not.toHaveBeenCalled();
  });

  it('should return an error if there is an issue with the database operation', async () => {
    mockedFindUnique.mockRejectedValue(new Error('Database error'));
    mockedFormatError.mockReturnValue({
      success: false,
      errors: [{ message: 'Error deleting message.', path: ['database'] }],
    });

    const result = await deleteMessage(1, 1);

    expect(result).toEqual({
      success: false,
      errors: [{ message: 'Error deleting message.', path: ['database'] }],
    });
    expect(mockedFindUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockedDelete).not.toHaveBeenCalled();
    expect(mockedDeleteVideoFromCloudinary).not.toHaveBeenCalled();
  });
});
