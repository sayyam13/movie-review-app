import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all movies
export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      include: {
        reviews: false,
      },
    });
    return NextResponse.json(movies, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch movies:', error);
    return NextResponse.json({ error: "Failed to fetch movies" }, { status: 500 });
  }
}


// POST a new movie
export async function POST(request: Request) {
  const { name, releaseDate} = await request.json();

  try {
    const newMovie = await prisma.movie.create({
      data: {
        name,
        releaseDate: new Date(releaseDate),
      },
    });
    return NextResponse.json(newMovie, { status: 201 });
  } catch (error) {
    console.error('Failed to create movies:', error);
    return NextResponse.json({ error: "Failed to create movie" }, { status: 500 });
  }
}

// PUT for updating a movie
export async function PUT(request: Request) {
  const { id, name, releaseDate} = await request.json();
  try {
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        name,
        releaseDate: new Date(releaseDate),
      },
    });
    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    console.error('Failed to update movies:', error);
    return NextResponse.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

// DELETE a movie
export async function DELETE(request: Request) {
  const { id } = await request.json();

  try {
    await prisma.movie.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Movie deleted" }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete movies:', error);
    return NextResponse.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}
