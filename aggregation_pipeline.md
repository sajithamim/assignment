// Aggregation Pipeline for MongoDB

db.sales.aggregate([
  // Step 1: Unwind the items array to process each item separately
  { 
    $unwind: "$items" 
  },
  
  // Step 2: Add fields for year, month, and calculate revenue for each item
  {
    $addFields: {
      year: { $year: "$date" },
      month: { $month: "$date" },
      revenue: { $multiply: ["$items.quantity", "$items.price"] }
    }
  },
  
  // Step 3: Group by store, year, and month to calculate total revenue and average item price
  {
    $group: {
      _id: {
        store: "$store",
        year: "$year",
        month: "$month"
      },
      totalRevenue: { $sum: "$revenue" },
      itemPrices: { $push: "$items.price" }
    }
  },
  
  // Step 4: Calculate the average price of items sold
  {
    $addFields: {
      averagePrice: { $avg: "$itemPrices" }
    }
  },

  // Step 5: Format the month to be in "YYYY-MM" format
  {
    $addFields: {
      month: {
        $concat: [
          { $toString: "$_id.year" },
          "-",
          { 
            $cond: {
              if: { $lt: ["$_id.month", 10] }, // Add leading zero to months < 10
              then: { $concat: ["0", { $toString: "$_id.month" }] },
              else: { $toString: "$_id.month" }
            }
          }
        ]
      }
    }
  },

  // Step 6: Project the final fields (store, month, totalRevenue, averagePrice) in the desired order
  {
    $project: {
      _id: 0,
      store: "$_id.store",
      month: 1,
      totalRevenue: 1,
      averagePrice: 1
    }
  },

  // Step 7: Sort by store (ascending) and by month (ascending)
  {
    $sort: {
      "store": 1,  // Sort by store in ascending order
      "month": 1   // Sort by formatted month in ascending order
    }
  }
]).pretty()
