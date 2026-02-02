const WellnessEntry = require('../models/WellnessEntry');

// Helper to parse date range from query params
function parseDateRange(query) {
  const { start, end, days } = query;
  let startDate, endDate;
  if (start && end) {
    startDate = new Date(start);
    endDate = new Date(end);
  } else if (days) {
    endDate = new Date();
    startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days, 10));
  } else {
    endDate = new Date();
    startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
  }
  // normalize to day boundaries
  startDate.setHours(0,0,0,0);
  endDate.setHours(23,59,59,999);
  return { startDate, endDate };
}

exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = parseDateRange(req.query);

    const pipeline = [
      { $match: { user_id: require('mongoose').Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
      { $project: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        mood_today: 1,
        sleep_hours: 1,
        stress_level: 1,
        anxiety_level: 1
      } },
      { $group: {
        _id: "$day",
        avgMood: { $avg: "$mood_today" },
        avgSleep: { $avg: "$sleep_hours" },
        avgStress: { $avg: "$stress_level" },
        avgAnxiety: { $avg: "$anxiety_level" },
        count: { $sum: 1 }
      } },
      { $sort: { _id: 1 } }
    ];

    const results = await WellnessEntry.aggregate(pipeline);

    // Map to date/value objects
    const history = results.map(r => ({ date: r._id, avgMood: r.avgMood, avgSleep: r.avgSleep, avgStress: r.avgStress, avgAnxiety: r.avgAnxiety, count: r.count }));

    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = parseDateRange(req.query);

    const matchStage = { user_id: require('mongoose').Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } };

    const summaryPipeline = [
      { $match: matchStage },
      { $group: {
        _id: null,
        avgMood: { $avg: "$mood_today" },
        avgSleep: { $avg: "$sleep_hours" },
        avgStress: { $avg: "$stress_level" },
        avgAnxiety: { $avg: "$anxiety_level" },
        totalEntries: { $sum: 1 }
      } }
    ];

    const dayPipeline = [
      { $match: matchStage },
      { $project: { day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, mood_today: 1 } },
      { $group: { _id: "$day", avgMood: { $avg: "$mood_today" }, count: { $sum: 1 } } },
      { $sort: { avgMood: -1 } }
    ];

    const [summaryRes] = await WellnessEntry.aggregate(summaryPipeline);
    const dayAgg = await WellnessEntry.aggregate(dayPipeline);

    const bestDay = dayAgg.length ? dayAgg[0] : null;
    const worstDay = dayAgg.length ? dayAgg[dayAgg.length - 1] : null;

    res.json({
      success: true,
      summary: {
        avgMood: summaryRes?.avgMood || 0,
        avgSleep: summaryRes?.avgSleep || 0,
        avgStress: summaryRes?.avgStress || 0,
        avgAnxiety: summaryRes?.avgAnxiety || 0,
        totalEntries: summaryRes?.totalEntries || 0,
        bestDay: bestDay ? { date: bestDay._id, avgMood: bestDay.avgMood, count: bestDay.count } : null,
        worstDay: worstDay ? { date: worstDay._id, avgMood: worstDay.avgMood, count: worstDay.count } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
