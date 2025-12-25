import clientPromise from "../mongodb.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  console.log(`[${new Date().toISOString()}] Received request: ${req.method} ${req.url}`);

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection("notices");

    // ------------------------------
    // OPTIONS: Handle preflight requests
    // ------------------------------
    if (req.method === 'OPTIONS') {
      return res.status(200).send('OK');
    }

    // ------------------------------
    // GET: Fetch Notices with Filters
    // ------------------------------
    if (req.method === "GET") {
      try {
        console.log("[LOG] Handling GET request");
        const {
          search = "",
          status = "",
          departmentsOrIndividuals = "",
          publishedOn = "", // Add publishedOn here
          page = 1,
          limit = 6,
        } = req.query;



        const query = {}; // Initialize query object
        // Search by text index (title, employeeName, employeeId) or by _id
        if (search) {
          // If the search term looks like an ObjectId, try to search by _id
          if (ObjectId.isValid(search)) {
            query.$or = [{ _id: new ObjectId(search) }];
          } else {
            // Otherwise, use the text index for general search across relevant fields
            query.$text = { $search: search };
          }
        }

        // Apply status filter for fetching data
        const dataQuery = { ...query };
        if (status === "Published") dataQuery.status = "Published";
        if (status === "Unpublished") dataQuery.status = "Unpublished";
        if (status === "Draft") dataQuery.status = "Draft";

        // Apply departmentsOrIndividuals filter
        if (departmentsOrIndividuals) {
          const formattedDepartment = departmentsOrIndividuals.replace(/\+/g, ' ');
          dataQuery.targetDepartmentOrIndividual = new RegExp(`^${formattedDepartment}$`, "i");
        }

        // Apply publishedOn filter
        if (publishedOn) {
          dataQuery.publishingDate = publishedOn;
        }

        // Fetch data
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const notices = await collection
          .find(dataQuery) // Use dataQuery for fetching filtered notices
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .toArray();
        
        // Count total for pagination based on current filters
        const total = await collection.countDocuments(dataQuery);

        // Count for active (Published) and Draft notices regardless of current data filters
        const publishedCount = await collection.countDocuments({ status: "Published" });
        const draftCount = await collection.countDocuments({ status: "Draft" });



        console.log("[LOG] Successfully fetched notices");
        return res.status(200).json({
          data: notices,
          pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            publishedCount, // New
            draftCount,     // New
          },
        });

      } catch (err) {
        console.error("[ERROR] Failed to fetch notices:", err);
        return res.status(500).json({ error: "Failed to fetch notices", details: err.message });
      }
    }

    // ------------------------------
    // POST: Create a Notice
    // ------------------------------
    if (req.method === "POST") {
      try {
        console.log("[LOG] Handling POST request");
        const { title, description, noticeType, publishingDate, fileUrl, status, targetDepartmentOrIndividual, employeeId, employeeName, position } = req.body;
        console.log("[LOG] Request body:", req.body);

        // Validation
        if (!title || !description || !noticeType || !employeeId || !employeeName || !position) { // Added employee fields to validation
          console.log("[VALIDATION_ERROR] Required fields missing");
          return res.status(400).json({ error: "Required fields missing" });
        }

        const newNotice = {
          title,
          description,
          noticeType,
          targetDepartmentOrIndividual,
          employeeId,
          employeeName,
          position,
          publishingDate: publishingDate || null,
          fileUrl: fileUrl || null,
          status: status || "Unpublished",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log("[LOG] Inserting new notice:", newNotice);
        const result = await collection.insertOne(newNotice);
        console.log("[LOG] Notice inserted successfully:", result);

        return res.status(201).json({
          message: "Notice created successfully",
          id: result.insertedId,
        });

      } catch (err) {
        console.error("[ERROR] Failed to create notice:", err);
        return res.status(500).json({ error: "Failed to create notice", details: err.message });
      }
    }

    // ------------------------------
    console.log(`[WARN] Method not allowed: ${req.method}`);
    return res.status(405).json({ message: "Method Not Allowed" });

  } catch (err) {
    console.error("[ERROR] An error occurred in the main handler:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
