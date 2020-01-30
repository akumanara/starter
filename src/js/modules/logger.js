
const config = {
  token: 'lkajdsas',
  endpoint: 'https://www.antmoves.com/',
};


function logToServer(msg) {
  const dataToPost = {
    token: config.token,
    msg,
  };

  fetch(config.endpoint, {
    method: 'post',
    body: JSON.stringify(dataToPost),
  }).then((response) => response.json()).then((data) => {
    console.log(data);
  }).catch((err) => {
    // We have an error (server down)
  });
}

const handleError = (msg, url, lineNo, columnNo, error) => {
  const objToLog = {
    msg,
    url,
    lineNo,
    columnNo,
    errorName: error.name,
    errorMessage: error.message,
    errorStack: error.stack,
  };
  console.log(objToLog);
  logToServer(objToLog);
};


window.onerror = handleError;
