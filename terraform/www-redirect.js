exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const host = request.headers.host[0].value;

  if (host === "www.${var.domain_name}") {
    return {
      status: "301",
      statusDescription: "Moved Permanently",
      headers: {
        location: [
          {
            key: "Location",
            value: "https://${var.domain_name}" + request.uri,
          },
        ],
      },
    };
  }

  return request;
};
