const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://TravelHub:Jk3N4t0kBpiO4Se8@cluster0.fgltgmp.mongodb.net/?appName=Cluster0";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("TravelHub");
    const users = await db.collection("user").find().toArray();
    console.log("Users in DB:");
    users.forEach(u => console.log(`- Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
main();
