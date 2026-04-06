import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { connectToDatabase } from '@/lib/mongodb';
import Phone from '@/models/Phone';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await connectToDatabase();

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const phone = await Phone.findById(id)
          .populate('seller', 'name email phone city')
          .lean();

        if (!phone) {
          return res.status(404).json({ message: 'Phone not found' });
        }

        // Increment view count
        await Phone.findByIdAndUpdate(id, { $inc: { views: 1 } });

        res.status(200).json({ phone });
      } catch (error) {
        console.error('Get phone error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'PUT':
      try {
        const phone = await Phone.findById(id);

        if (!phone) {
          return res.status(404).json({ message: 'Phone not found' });
        }

        // Check if user owns the phone or is admin
        if (phone.seller.toString() !== session.user.id && session.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
        }

        const {
          title,
          brand,
          model,
          condition,
          price,
          description,
          images,
          location,
          specifications,
          isActive,
          isSold,
        } = req.body;

        const updatedPhone = await Phone.findByIdAndUpdate(
          id,
          {
            title,
            brand,
            model,
            condition,
            price: price ? parseInt(price) : phone.price,
            description,
            images,
            location,
            specifications,
            isActive,
            isSold,
            updatedAt: new Date(),
          },
          { new: true }
        ).populate('seller', 'name email phone city');

        res.status(200).json({
          message: 'Phone updated successfully',
          phone: updatedPhone,
        });
      } catch (error) {
        console.error('Update phone error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'DELETE':
      try {
        const phone = await Phone.findById(id);

        if (!phone) {
          return res.status(404).json({ message: 'Phone not found' });
        }

        // Check if user owns the phone or is admin
        if (phone.seller.toString() !== session.user.id && session.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
        }

        await Phone.findByIdAndDelete(id);

        res.status(200).json({ message: 'Phone deleted successfully' });
      } catch (error) {
        console.error('Delete phone error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}