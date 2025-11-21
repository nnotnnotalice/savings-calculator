export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { goal, have, perDay } = req.body;
      
      // ВСЮ ЛОГИКУ ПЕРЕНЕСЁМ СЮДА БЕЗ ОТДЕЛЬНОЙ ФУНКЦИИ
      const goalNum = Number(goal);
      const haveNum = Number(have) || 0;
      const perDayNum = Number(perDay);

      if (!goalNum || !perDayNum) {
        return res.status(200).json({
          success: true,
          data: {days: "❓", result: "Впиши числа в строки калькулятора"}
        });
      }

      let remaining = goalNum - haveNum;
      let days, finalAmount;

      if (remaining <= 0) {
        days = 0;
        finalAmount = haveNum;
      } else {
        days = Math.ceil(remaining / perDayNum);
        finalAmount = haveNum + perDayNum * days;
      }

      return res.status(200).json({
        success: true,
        data: {
          days: days,
          result: finalAmount
        }
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Only POST method allowed'
  });
}
