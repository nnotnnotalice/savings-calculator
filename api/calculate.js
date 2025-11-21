export default async function handler(request, response) {
  // Разрешаем CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { goal, have, perDay } = body;
      
      // Преобразуем в числа
      const goalNum = Number(goal);
      const haveNum = Number(have) || 0;
      const perDayNum = Number(perDay);

      // Проверяем валидность
      if (!goalNum || goalNum <= 0 || !perDayNum || perDayNum <= 0) {
        return response.status(200).json({
          success: true,
          data: { days: "❓", result: "Впиши числа в строки калькулятора" }
        });
      }

      // Вычисляем
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
      return response.status(200).json({
        success: true,
        data: {
          days: days,
          result: finalAmount
        }
      });
      
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: 'Ошибка сервера: ' + error.message
      });
    }
  }

  // Если метод не POST
  return response.status(405).json({
    success: false,
    error: 'Only POST method allowed'
  });
}
