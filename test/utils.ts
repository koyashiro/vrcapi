const baseUrl = "https://vrchat.com/api/1/";

const apiKey = "JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26";

const authTokenTemp = Deno.env.get("VRC_API_AUTH_TOKEN");
if (!authTokenTemp) {
  throw new Error();
}
const authToken = authTokenTemp as string;

export { apiKey, authToken, baseUrl };
