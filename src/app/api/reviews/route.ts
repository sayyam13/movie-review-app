import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all reviews for a specific movie
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get("movieId");

  try {
    const reviews = await prisma.review.findMany({
      where: { 
        movieId : Number(movieId), 
      },
    });
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// POST a new review for a movie
export async function POST(request: Request) {
  const { movieId, reviewer, rating, comments } = await request.json();
  try {
    const newReview = await prisma.review.create({
      data: {
        movieId,
        reviewer,
        rating,
        comments,
      },
    });

    // Step 2: Calculate the new average rating
    const { _avg } = await prisma.review.aggregate({
      where: { movieId: Number(movieId) },
      _avg: { rating: true },
    });

    // Step 3: Update the movie with the new average rating
    await prisma.movie.update({
      where: { id: Number(movieId) },
      data: { averageRating: _avg.rating || 0 },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Failed to create review":', error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

// PUT /api/reviews/:id - Update a review
export async function PUT(request: Request) {
  const { id, reviewer, rating, comments } = await request.json();

  try {
    const updatedReview = await prisma.review.update({
      where: { id: Number(id) },
      data: {
        reviewer,
        rating,
        comments,
      },
    });
    // Step 2: Get the movieId from the updated review
    const movieId = updatedReview.movieId;

    // Step 3: Recalculate the new average rating
    const { _avg } = await prisma.review.aggregate({
      where: { movieId },
      _avg: { rating: true },
    });

    // Step 4: Update the movie with the new average rating
    await prisma.movie.update({
      where: { id: movieId },
      data: { averageRating: _avg.rating || 0 },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error('Failed to update review":', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

// DELETE a review
export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    await prisma.review.delete({
      where: { id: Number(id)},
    });
    return NextResponse.json({ message: "Review deleted" }, { status: 200 });
  } catch (error) {
    console.error('Failed to delte review":', error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
