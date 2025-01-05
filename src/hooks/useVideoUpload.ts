import React, { useState, useCallback, useRef } from 'react';

import { UseVideoUploadReturn } from '@/types/message-types';

export const useVideoUpload = (
  setSelectedVideo: (url: string) => void,
  setVideoPublicId: (id: string) => void
): UseVideoUploadReturn => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null!);

  const triggerFileInput = useCallback((): void => {
    if (inputFileRef.current && !isUploading) {
      inputFileRef.current.click();
    }
  }, [isUploading]);

  const validateEnv = useCallback((): string | null => {
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!uploadPreset) {
      return 'Missing Cloudinary upload preset. Check your environment variables.';
    }
    return null;
  }, []);

  const prepareFormData = useCallback((file: File): FormData => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );
    return formData;
  }, []);

  const handleResponse = useCallback(
    async (response: Response): Promise<void> => {
      const data = await response.json();
      if (data.secure_url && data.public_id) {
        setSelectedVideo(data.secure_url);
        setVideoPublicId(data.public_id);
      } else {
        setUploadError('Failed to upload video. Please try again.');
      }
    },
    [setSelectedVideo, setVideoPublicId, setUploadError]
  );

  const handleVideoChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const files = e.target.files;
      if (!files || !files[0] || isUploading) return;

      const file = files[0];
      setIsUploading(true);
      setUploadError(null);

      const envError = validateEnv();
      if (envError) {
        setUploadError(envError);
        setIsUploading(false);
        return;
      }

      const formData = prepareFormData(file);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: 'POST', body: formData }
        );
        await handleResponse(response);
      } catch (error) {
        console.error('Video upload error:', error);
        setUploadError('An error occurred during upload. Please try again.');
      } finally {
        setIsUploading(false);
        if (inputFileRef.current) inputFileRef.current.value = '';
      }
    },
    [isUploading, validateEnv, prepareFormData, handleResponse]
  );

  return {
    isUploading,
    uploadError,
    inputFileRef,
    triggerFileInput,
    handleVideoChange,
  };
};
