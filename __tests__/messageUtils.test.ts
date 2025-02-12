import {
  handlePrepareFormData,
  createOptimisticMessage,
  handleValidateMessage,
} from '@/utils/messageUtils';

describe('messageUtils', () => {
  describe('handlePrepareFormData', () => {
    it('creates FormData with message content and sender ID', () => {
      const formData = handlePrepareFormData({
        newMessage: 'Hello, World!',
        signedInUserId: 1,
        selectedRecipientId: 2,
        selectedVideo: null,
        videoPublicId: null,
      });

      expect(formData.get('content')).toBe('Hello, World!');
      expect(formData.get('senderId')).toBe('1');
      expect(formData.get('recipientId')).toBe('2');
      expect(formData.get('videoUrl')).toBeNull();
      expect(formData.get('videoPublicId')).toBeNull();
    });

    it('adds video file to FormData when provided', () => {
      const mockFile = new File(['video content'], 'video.mp4', {
        type: 'video/mp4',
      });

      const formData = handlePrepareFormData({
        newMessage: 'Video Message',
        signedInUserId: 1,
        selectedRecipientId: 2,
        selectedVideo: mockFile,
        videoPublicId: null,
      });

      expect(formData.get('videoUrl')).toBe(mockFile);
    });

    it('adds videoPublicId to FormData when provided', () => {
      const formData = handlePrepareFormData({
        newMessage: 'Hello',
        signedInUserId: 1,
        selectedRecipientId: 2,
        selectedVideo: null,
        videoPublicId: 'public-video-id',
      });

      expect(formData.get('videoPublicId')).toBe('public-video-id');
    });

    it('handles null recipient correctly', () => {
      const formData = handlePrepareFormData({
        newMessage: 'Hello',
        signedInUserId: 1,
        selectedRecipientId: null,
        selectedVideo: null,
        videoPublicId: null,
      });

      expect(formData.has('recipientId')).toBe(false);
    });
  });

  describe('createOptimisticMessage', () => {
    it('creates an optimistic message when a recipient is selected', () => {
      const optimisticMessage = createOptimisticMessage({
        temporaryId: 999,
        newMessage: 'This is a test message',
        signedInUserId: 1,
        selectedRecipientId: 2,
        selectedVideo: null,
        videoUrl: null,
      });

      expect(optimisticMessage).toMatchObject({
        id: 999,
        content: 'This is a test message',
        sender: { id: 1, username: 'You' },
        recipientId: 2,
        videoUrl: null,
        createdAt: expect.any(Date),
      });

      expect(optimisticMessage?.createdAt).toBeInstanceOf(Date);
    });

    it('returns null if no recipient is selected', () => {
      const optimisticMessage = createOptimisticMessage({
        temporaryId: 999,
        newMessage: 'This message will not be created',
        signedInUserId: 1,
        selectedRecipientId: null,
        selectedVideo: null,
        videoUrl: null,
      });

      expect(optimisticMessage).toBeNull();
    });

    it('sets videoUrl correctly when provided', () => {
      const optimisticMessage = createOptimisticMessage({
        temporaryId: 999,
        newMessage: 'Video message',
        signedInUserId: 1,
        selectedRecipientId: 2,
        selectedVideo: null,
        videoUrl: 'https://video-url.com',
      });

      expect(optimisticMessage?.videoUrl).toBe('https://video-url.com');
    });
  });

  describe('handleValidateMessage', () => {
    it('returns true for non-empty messages', () => {
      expect(handleValidateMessage('Hello!', null)).toBe(true);
    });

    it('returns true if a video is selected even if message is empty', () => {
      expect(handleValidateMessage('', 'video.mp4')).toBe(true);
    });

    it('returns false for empty message with no video', () => {
      expect(handleValidateMessage('', null)).toBe(false);
    });
  });
});
