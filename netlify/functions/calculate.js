exports.handler = async function(event, context) {
  // Настраиваем CORS заголовки
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Обрабатываем предварительные OPTIONS запросы
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers, 
      body: '' 
    };
  }

  // Обрабатываем POST запросы
  if (event.httpMethod === 'POST') {
    try {
      const { goal, have, perDay } = JSON.parse(event.body);
      
      // Преобразуем в числа
      const goalNum = Number(goal);
      const haveNum = Number(have) || 0;
      const perDayNum = Number(perDay);

      // Проверяем валидность
      if (!goalNum || !perDayNum) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            data: { 
              days: "❓", 
              result: "Впиши числа в строки калькулятора" 
            }
          })
        };
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

      // Возвращаем успешный результат
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: { 
            days: days, 
            result: finalAmount 
          }
        })
      };

    } catch (error) {
      // Обрабатываем ошибки
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Ошибка: ' + error.message 
        })
      };
    }
  }

  // Если метод не POST
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ 
      error: 'Method not allowed' 
    })
  };
};
