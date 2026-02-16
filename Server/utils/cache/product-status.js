const { useMemory } = require("../memory");

const productStatusCache = useMemory(null);

productStatusCache.toUpdate(async (memory, lowThresholdString) => {
  const lowThreshold = parseInt(lowThresholdString, 10) || 5;

  const pipeline = [
    {
      $addFields: {
        available: {
          $ifNull: [
            "$stock",
            { $ifNull: ["$quantity", { $ifNull: ["$inventory", 0] }] },
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        outOfStock: {
          $sum: { $cond: [{ $lte: ["$available", 0] }, 1, 0] },
        },
        inStock: {
          $sum: { $cond: [{ $gt: ["$available", 0] }, 1, 0] },
        },
        lowStock: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gt: ["$available", 0] },
                  { $lt: ["$available", lowThreshold] },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
    {
      $project: { _id: 0, total: 1, outOfStock: 1, inStock: 1, lowStock: 1 },
    },
  ];

  const result = await db.collection("products").aggregate(pipeline).toArray();
  const counts = result[0] || {
    total: 0,
    outOfStock: 0,
    inStock: 0,
    lowStock: 0,
  };

  memory.set({
    total: counts.total,
    outOfStock: counts.outOfStock,
    inStock: counts.inStock,
    lowStock: counts.lowStock,
  });
});

module.exports = { productStatusCache };
