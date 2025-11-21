// Явно указываем CommonJS синтаксис
module.exports = async (req, res) => {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      let body = '';
      
      // Читаем тело запроса
      for await (const chunk of req) {
        body += chunk;
      }
      
      const { goal, have, perDay } = JSON.parse(body);
      
      // Преобразуем в числа
      const goalNum = Number(goal);
      const haveNum = Number(have) || 0;
      const perDayNum = Number(perDay);

      // Проверяем валидность
      if (!goalNum || !perDayNum) {
        return res.json({
          success: true,
          data: { days: "❓", result: "Впиши числа в строки калькулятора" }
        });
      }

      // Вычисления
      const remaining = goalNum - haveNum;
      let days, finalAmount;

      if (remaining <= 0) {
        days = 0;
        finalAmount = haveNum;
      } else {
        days = Math.ceil(remaining / perDayNum);
        finalAmount = haveNum + perDayNum * days;
      }

      // Возвращаем результат
      return res.json({
        success: true,
        data: { days, result: finalAmount }
      });
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Ошибка: ' + error.message
      });
    }
  }

  // Если метод не POST
  return res.status(405).json({
    success: false,
    error: 'Only POST method allowed'
  });
};
