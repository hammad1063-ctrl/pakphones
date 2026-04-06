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

  const currentUser = session.user as { id?: string; role?: string };

  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      try {
        const {
          page = 1,
          limit = 10,
          brand,
          model,
          minPrice,
          maxPrice,
          city,
          condition,
          search,
        } = req.query;

        const query: any = { isActive: true };

        if (brand) query.brand = new RegExp(brand as string, 'i');
        if (model) query.model = new RegExp(model as string, 'i');
        if (condition) query.condition = condition;
        if (city) query['location.city'] = new RegExp(city as string, 'i');
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = parseInt(minPrice as string);
          if (maxPrice) query.price.$lte = parseInt(maxPrice as string);
        }
        if (search) {
          query.$text = { $search: search as string };
        }

        const phones = await Phone.find(query)
          .populate('seller', 'name email phone city')
          .sort({ createdAt: -1 })
          .limit(parseInt(limit as string))
          .skip((parseInt(page as string) - 1) * parseInt(limit as string));

        const total = await Phone.countDocuments(query);

        res.status(200).json({
          phones,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total,
            pages: Math.ceil(total / parseInt(limit as string)),
          },
        });
      } catch (error) {
        console.error('Get phones error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    case 'POST':
      try {
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
        } = req.body;

        // Validation
        if (!title || !brand || !model || !condition || !price || !description || !images || !location || !specifications) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        const phone = new Phone({
          title,
          brand,
          model,
          condition,
          price: parseInt(price),
          description,
          images,
          location,
          specifications,
          seller: currentUser.id,
        });

        await phone.save();

        const savedPhone = await Phone.findById(phone._id).populate('seller', 'name email phone city');

        res.status(201).json({
          message: 'Phone listing created successfully',
          phone: savedPhone,
        });
      } catch (error) {
        console.error('Create phone error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
}