import { deleteVideo } from '@/app/actions/deleteVideo';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { messageId, userId } = req.body;

    // Validate input
    if (!messageId || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request. Missing parameters.',
      });
    }

    // Call the backend logic
    const response = await deleteVideo(Number(messageId), Number(userId));
    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(500).json({ success: false, error: response.errors });
    }
  }

  // Handle unsupported HTTP methods
  res.setHeader('Allow', ['DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
