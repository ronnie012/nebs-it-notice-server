import clientPromise from "../mongodb.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  // ------------------------------
  // OPTIONS: Handle preflight requests
  // ------------------------------
  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }

  const client = await clientPromise;
  const db = client.db(process.env.MONGO_DB);
  const collection = db.collection("notices");

  const { id } = req.query;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid notice ID" });
  }

  // ------------------------------
  // GET: Single Notice
  // ------------------------------
  if (req.method === "GET") {
    try {
      const notice = await collection.findOne({ _id: new ObjectId(id) });

      if (!notice) return res.status(404).json({ error: "Notice not found" });

      return res.status(200).json(notice);

    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch notice", details: err.message });
    }
  }

  // ------------------------------
  // PATCH: Update Notice Details or Status
  // ------------------------------
  if (req.method === "PATCH") {
    try {
      const { status, title, description, noticeType, publishingDate, fileUrl, employeeId, employeeName, position } = req.body;
      const updateFields = { updatedAt: new Date() };

      // Update status if provided and valid
      if (status) {
        if (!["Published", "Unpublished", "Draft"].includes(status)) {
          return res.status(400).json({ error: "Invalid status value" });
        }
        updateFields.status = status;
        if (status === "Published") {
          updateFields.publishedAt = new Date();
        } else if (status === "Unpublished" || status === "Draft") {
          updateFields.publishedAt = null; // Clear publishedAt if not Published
        }
      }

      // Update other fields if provided
      if (title) updateFields.title = title;
      if (description) updateFields.description = description;
      if (noticeType) updateFields.noticeType = noticeType;
      if (publishingDate !== undefined) updateFields.publishingDate = publishingDate;
      if (fileUrl !== undefined) updateFields.fileUrl = fileUrl;
      if (employeeId !== undefined) updateFields.employeeId = employeeId;
      if (employeeName !== undefined) updateFields.employeeName = employeeName;
      if (position !== undefined) updateFields.position = position;

      const update = {
        $set: updateFields,
      };

      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        update
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Notice not found or not updated" });
      }

      return res.status(200).json({ message: "Notice updated successfully" });

    } catch (err) {
      return res.status(500).json({ error: "Failed to update notice", details: err.message });
    }
  }

  // ------------------------------
  // DELETE: Delete a Notice
  // ------------------------------
  if (req.method === "DELETE") {
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Notice not found" });
      }

      return res.status(200).json({ message: "Notice deleted successfully" });

    } catch (err) {
      return res.status(500).json({ error: "Failed to delete notice", details: err.message });
    }
  }

  // ------------------------------
  return res.status(405).json({ message: "Method Not Allowed" });
}
