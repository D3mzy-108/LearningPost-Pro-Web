interface HttpResponse {
  success: boolean;
  message: string;
  data: any;
}

async function postFunction(
  url: string,
  requestBody: Record<string, string>
): Promise<HttpResponse> {
  try {
    // SEND POST REQUEST TO API
    const encodedBody = new URLSearchParams(requestBody);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: encodedBody,
    });

    // GET RESPONSE FROM API
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}`,
      } as HttpResponse;
    }
    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      data: data,
    } as HttpResponse;
  } catch (error) {
    return {
      success: false,
      message: "Connection Error",
    } as HttpResponse;
  }
}

async function getFunction(url: string): Promise<HttpResponse> {
  try {
    const response = await fetch(url);

    // GET RESPONSE FROM API
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}`,
      } as HttpResponse;
    }
    const data = await response.json();
    return {
      success: data.success,
      message: data.message,
      data: data,
    } as HttpResponse;
  } catch (error) {
    return {
      success: false,
      message: "Connection Error",
    } as HttpResponse;
  }
}

const http = {
  post: postFunction,
  get: getFunction,
};

export default http;
