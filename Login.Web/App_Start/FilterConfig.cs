using System;
using System.Web;
using System.Web.Mvc;

namespace Login.Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }

    public class RequireRootHostAttribute : FilterAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext == null)
                throw new ArgumentNullException("filterContext");

            if (filterContext.HttpContext.Request.IsLocal)
                return;

            if (!AppContext.Configuration.RequireRootHost)
                return;

            if (!filterContext.HttpContext.Request.Url.Host.StartsWith("www."))
                return;

            if (filterContext.HttpContext.Request.HttpMethod != "GET")
                throw new InvalidOperationException("RequireRootHost_MustRemoveWwW");

            var httpsPort = RequireHttpsAttribute.GetHttpsPort();
            if (httpsPort == null)
                return;

            filterContext.Result = new RedirectResult($"https://{filterContext.HttpContext.Request.Url.Host.Remove(0, 4)}:{httpsPort}{filterContext.HttpContext.Request.RawUrl}");
        }
    }
}
