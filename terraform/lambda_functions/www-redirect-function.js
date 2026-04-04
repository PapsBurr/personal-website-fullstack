exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const host = request.headers.host[0].value;

  if (host === process.env.TARGET_DOMAIN) {
    return {
      status: "301",
      statusDescription: "Moved Permanently",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://" + process.env.TARGET_DOMAIN + request.uri,
          },
        ],
      },
    };
  }

  return request;
};
