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

async function uploadFileFunction(
  url: string,
  formData: FormData
): Promise<HttpResponse> {
  try {
    // SEND POST REQUEST TO API with FormData
    // fetch automatically sets the 'Content-Type': 'multipart/form-data' header
    // along with the correct boundary when a FormData object is used as the body.
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    // GET RESPONSE FROM API
    if (!response.ok) {
      return {
        success: false,
        message: `HTTP Error ${response.status}`,
      } as HttpResponse;
    }

    // Attempt to parse JSON response. Some file upload APIs might return plain text or no body.
    // We'll try to parse JSON, but if it fails, we'll return a generic success.
    let data: any = null;
    try {
      data = await response.json();
    } catch (jsonError) {
      // If response is not JSON, it might still be a success (e.g., 200 OK with no body)
      console.warn(
        "Response was not JSON, assuming success if status is OK.",
        jsonError
      );
      return {
        success: true,
        message: `Upload successful (HTTP ${response.status}), no JSON response body.`,
        data: null,
      } as HttpResponse;
    }

    return {
      success: data.success ?? true,
      message: data.message ?? "Upload successful",
      data: data,
    } as HttpResponse;
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message, // Ensure error is treated as Error type
    } as HttpResponse;
  }
}

const http = {
  post: postFunction,
  get: getFunction,
  postMultiPartData: uploadFileFunction,
};

export default http;
