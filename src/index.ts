import { NextFunction, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import { app } from './app/app';
import { PrismaClient } from '@prisma/client';
import { loginSchema, registerSchema } from './yupSchemas';
import { checkPassword, generateToken, hashPassword, verifyToken } from './utils/utilFunctions';
import { IReviewsDto } from './interfaces';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  return next();
}

const PORT = process.env.PORT;
const prisma = new PrismaClient();

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    await loginSchema.validate(req.body, { abortEarly: false });

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !checkPassword(password, user.password)) {
      return res.status(401).json({token: null, message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.email);

    return res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ token: null, message: 'Internal Server Error' });
  }
});

app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    await registerSchema.validate(req.body, { abortEarly: false });

    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return res.status(200).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.get('/auth/check', authMiddleware, async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: decodedToken.email,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'User found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/company', authMiddleware, async (req: Request, res: Response) => {
  try {
    const response: AxiosResponse = await axios.post(
      'https://data.soleadify.com/match/v4/companies',
      JSON.stringify(req.body),
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.VERIDION_API_KEY,
        },
      },
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/reviews/:companyName', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { companyName } = req.params;

    const companyResponse: AxiosResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${companyName}&key=${process.env.GOOGLE_API_KEY}`);

    const { data } = companyResponse;

    const placeId = data.results[0]?.place_id;

    if (!placeId) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const reviewsResponse: AxiosResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating&key=${process.env.GOOGLE_API_KEY}`);

    const result : IReviewsDto = reviewsResponse.data.result;

    if (!result?.reviews) {
      return res.status(404).json({ success: false, message: 'No reviews found' });
    }

    return res.status(200).json({ success: true, message: 'Reviews found', reviews: result?.reviews, rating: result?.rating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
