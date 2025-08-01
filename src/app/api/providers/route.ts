import { NextRequest, NextResponse } from 'next/server';
import { getAvailableProviders, getDefaultProviders, getProviders } from '../../../providers/init';

export async function GET(request: NextRequest) {
  try {
    const availableProviders = getAvailableProviders();
    const defaultProviders = getDefaultProviders();
    
    // Get a sample of data from the database provider
    const { database } = getProviders();
    const stats = await database.getDashboardStats();
    const sampleCandidate = await database.getCandidate('1');

    return NextResponse.json({
      success: true,
      data: {
        availableProviders,
        defaultProviders,
        systemStats: stats,
        sampleData: {
          candidate: sampleCandidate,
          totalCandidates: stats.totalCandidates,
          pendingReferences: stats.pendingReferences,
          completedReferences: stats.completedReferences,
        }
      },
      message: 'Provider system is working correctly'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to get provider information'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    const { database } = getProviders();

    switch (action) {
      case 'createCandidate':
        const newCandidate = await database.createCandidate(data);
        return NextResponse.json({
          success: true,
          data: newCandidate,
          message: 'Candidate created successfully'
        });

      case 'getCandidate':
        const candidate = await database.getCandidate(data.id);
        return NextResponse.json({
          success: true,
          data: candidate,
          message: 'Candidate retrieved successfully'
        });

      case 'getStats':
        const stats = await database.getDashboardStats();
        return NextResponse.json({
          success: true,
          data: stats,
          message: 'Stats retrieved successfully'
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            message: 'Please provide a valid action'
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to process request'
      },
      { status: 500 }
    );
  }
} 