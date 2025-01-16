import {
  getUserStatisticsByYear,
  getMonthlyStatistics,
} from "../../services/chart/adminChartService.js";

export const getUserStatistics = async (req, res) => {
  const { year } = req.query;

  if (!year) {
    return res.status(400).json({ message: "Year is required" });
  }

  try {
    const statistics = await getUserStatisticsByYear(Number(year));
    return res.status(200).json(statistics);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch user statistics" });
  }
};

// Controller to handle the request and return statistics
export const getStatisticsByYear = async (req, res) => {
  try {
    const { year } = req.query; // Extract year from query parameters
    if (!year) {
      return res.status(400).json({ message: "Year parameter is required" });
    }

    const statistics = await getMonthlyStatistics(parseInt(year));

    res.status(200).json(statistics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching statistics", error: error.message });
  }
};
