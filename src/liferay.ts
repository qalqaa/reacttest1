// Пример использования с useQuery
// const useCountries = () =>
// useQuery({
//  queryKey:['countries'],
//  queryFn: () => LiferayQueryNoArgs('/country/get-countries')
// })

/**
 * Подключает работу типов при использовании Liferay
 */
declare global {
  interface Window {
    Liferay: typeof mockLiferay;
  }
}

type Args = Record<string, any>;

interface Request {
  [path: string]: Args;
}

type Resolver = (data: any) => void;
type Exception = (error: any) => void;

const email = "admin@admin.com";
const password = "admin";

const mainURL = "http://localhost:8080";

// const email = 'your@email.com'
// const password = 'your_password'

// const mainURL = "https://customdev02.wone-it.ru"

const baseURL = `${mainURL}/api/jsonws/invoke`;

const headers = new Headers();
headers.set("Authorization", "Basic " + btoa(email + ":" + password));

async function mockService(
  request: Request | Request[],
  resolver: Resolver,
  exception?: Exception
): Promise<void>;
async function mockService(
  path: string,
  args: Args,
  resolver: Resolver,
  exception?: Exception
): Promise<void>;
async function mockService(
  arg1: string | Request | Request[],
  arg2: Args | Resolver,
  arg3?: Resolver | Exception,
  exception?: Exception
): Promise<void> {
  let body: any = undefined;
  let resolverLocal: Resolver | undefined = undefined;
  let exceptionLocal: Exception | undefined = undefined;

  // Вариант 1 перегрузки
  if (
    ((typeof arg1 === "object" && arg1 !== null) || Array.isArray(arg1)) &&
    arg2 instanceof Function
  ) {
    body = JSON.stringify(arg1);
    resolverLocal = arg2;
    exceptionLocal = arg3;
  }

  // Вариант 2 перегрузки
  if (
    typeof arg1 === "string" &&
    typeof arg2 === "object" &&
    arg2 !== null &&
    !Array.isArray(arg2) &&
    arg3 instanceof Function
  ) {
    body = JSON.stringify({ [arg1]: arg2 });
    resolverLocal = arg3;
    exceptionLocal = exception;
  }

  if (!resolverLocal || !body) throw new Error("Bad arguments");

  fetch(baseURL, { headers, body, method: "POST" })
    .then((data) => {
      resolverLocal && resolverLocal(data.json());
    })
    .catch((error) => {
      exceptionLocal?.(error);
      throw new Error(error);
    });
}

const mockLiferay = {
  ThemeDisplay: {
    getLayoutId: (): number => 5,
    /**
     * Returns the relative URL for the page
     */
    getLayoutRelativeControlPanelURL: (): string =>
      "/group/guest/~/control_panel/manage",
    /**
     * Returns the relative URL for the page
     */
    getLayoutRelativeURL: (): string => "/web/guest/test",
    getLayoutURL: (): string => `${mainURL}/web/guest/test`,
    getParentLayoutId: (): number => 0,
    isControlPanel: (): boolean => false,
    isPrivateLayout: (): boolean => false,
    isVirtualLayout: (): boolean => false,
    getBCP47LanguageId: (): number => 0,
    /**
     * Returns the content delivery network (CDN) base URL, or the current portal URL if the CDN base URL is null
     */
    getCDNBaseURL: (): string => "",
    /**
     * Returns the content delivery network (CDN) dynamic resources host,
     *  or the current portal URL if the CDN dynamic resources host is null
     */
    getCDNDynamicResourcesHost: (): string => "",
    getCDNHost: (): string => "",
    getCompanyGroupId: (): number => 20123,
    /**
     * Returns the portal instance ID
     */
    getCompanyId: (): number => 20097,
    getDefaultLanguageId: (): number => 0,
    getDoAsUserIdEncoded: (): string => "",
    /**
     * Returns the user’s language ID
     */
    getLanguageId: (): number => 0,
    getParentGroupId: (): number => 20121,
    getPathContext: (): string => "",
    /**
     * Returns the relative path of the portlet’s image directory
     */
    getPathImage: (): string => "/image",
    /**
     * Returns the relative path of the directory containing the portlet’s JavaScript source files
     */
    getPathJavaScript: (): string => "/o/frontend-js-web",
    /**
     * Returns the path of the portal instance’s main directory
     */
    getPathMain: (): string => "/c",
    /**
     * Returns the path of the current theme’s image directory
     */
    getPathThemeImages: (): string => `${mainURL}/o/classic-theme/images`,
    /**
     * Returns the relative path of the current theme’s root directory
     */
    getPathThemeRoot: (): string => "/o/classic-theme",
    /**
     * Returns the primary key of the page
     */
    getPlid: (): number => 14,
    /**
     * Returns the portal instance’s base URL
     */
    getPortalURL: (): string => `${mainURL}`,
    /**
     * Returns the ID of the scoped or sub-scoped active group (e.g. site)
     */
    getScopeGroupId: (): number => 20121,
    getScopeGroupIdOrLiveGroupId: (): number => 20121,
    /**
     * Returns the session ID, or a blank string if the session ID is not available to the application
     */
    getSessionId: (): number => 0,
    // eslint-disable-next-line max-len
    getSiteAdminURL: (): string =>
      `${mainURL}/group/guest/~/control_panel/manage?p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view`,
    getSiteGroupId: (): number => 20121,
    getURLControlPanel: (): string => "/group/control_panel?refererPlid=14",
    getURLHome: (): string => `${mainURL}/web/guest`,
    getUserEmailAddress: (): string => `${email}`,
    getUserId: (): number => 38302,
    getUserName: (): string => "admin admin",
    isAddSessionIdToURL: (): boolean => false,
    isFreeformLayout: (): boolean => false,
    /**
     * Returns true if the current user is being impersonated.
     * Authorized administrative users can impersonate act as another user to test that user’s account
     */
    isImpersonated: (): boolean => false,
    /**
     * Returns true if the user is logged in to the portal
     */
    isSignedIn: (): boolean => false,
    isStateExclusive: (): boolean => false,
    isStateMaximized: (): boolean => false,
    isStatePopUp: (): boolean => false,
  },
  Service: mockService,
};

export const Liferay =
  process.env.NODE_ENV === "development" ? mockLiferay : window.Liferay;

/**
 * Адаптер для запроса на liferay сервис через простой интерфейс (специально убрана возможность вставлять аргументы,
 * с целью использовать 1 интерфейс для batch и одиночных запросов)
 * @param path - relative путь до ручки ()
 * @returns void
 */
export const LiferayQueryNoArgs = <T>(path: string) => {
  return new Promise((resolve: (value: T) => void, reject) => {
    Liferay.Service(
      path,
      {},
      function (data: T) {
        resolve(data);
      },
      function (error) {
        reject(error);
      }
    );
  });
};

/**
 * Адаптер для запросов в liferay сервис. Используется для batch и одиночных запросов.
 * @param request - объект или массив объектов с запросом
 * @returns void
 */
export const LiferayQuery = <T>(request: Request | Request[]) => {
  return new Promise((resolve: (value: T) => void, reject) => {
    Liferay.Service(
      request,
      function (data: T) {
        resolve(data);
      },
      function (error) {
        reject(error);
      }
    );
  });
};
