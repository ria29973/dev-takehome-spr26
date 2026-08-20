import connectDb from "./connectDb"

export async function register(){
    await connectDb();
}