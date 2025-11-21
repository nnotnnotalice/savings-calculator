export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { goal, have, perDay } = req.body;
      
      // ТВОЯ ЛОГИКА ИЗ APPS SCRIPT
      const result = calculate(goal, have, perDay);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  } else {
    res.status(405).json({
      success: false,
      error: 'Only POST method allowed'
    });
  }
}

// ТВОЯ ФУНКЦИЯ CALCULATE БЕЗ ИЗМЕНЕНИЙ
function calculate(goal, have, perDay) {
  goal = Number(goal);
  have = Number(have) || 0;
  perDay = Number(perDay);

  if (!goal || !perDay) {
    return {days: "❓", result: "Впиши числа в строки калькулятора"};
  }

  let remaining = goal - have;
  let days, finalAmount;

  if (remaining <= 0) {
    days = 0;
    finalAmount = have;
  } else {
    days = Math.ceil(remaining / perDay);
    finalAmount = have + perDay * days;
  }

  return {
    days: days,
    result: finalAmount
  };
}
