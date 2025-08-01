import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/lib/mongodb';
import UserData from '@/models/UserData';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { userId, email, ...formData } = body;
    
    if (!userId || !email) {
      return NextResponse.json(
        { error: 'User ID and email are required' },
        { status: 400 }
      );
    }
    
    // Upsert user data (update if exists, create if doesn't)
    const userData = await UserData.findOneAndUpdate(
      { userId },
      { 
        userId,
        email,
        ...formData
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );
    
    return NextResponse.json({
      success: true,
      data: userData
    });
    
  } catch (error) {
    console.error('Error saving user data:', error);
    return NextResponse.json(
      { error: 'Failed to save user data' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const userData = await UserData.findOne({ userId });
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: userData
    });
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
