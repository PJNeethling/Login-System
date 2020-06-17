using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Async;

namespace Login.Web.Controllers
{
    [RequireHttps, RequireRootHost]
    public class BaseController : Controller
    {
        #region Private Fields
        Type actionReturnType;
        #endregion

        #region Public Properties
        public bool IsPostRequest => Request.RequestType.Equals("post", StringComparison.OrdinalIgnoreCase);
        #endregion

        #region Protected Methods
        protected override void OnAuthorization(AuthorizationContext filterContext)
        {
            if (filterContext.ActionDescriptor is ReflectedActionDescriptor)
            {
                var actionDescriptor = filterContext.ActionDescriptor as ReflectedActionDescriptor;
                actionReturnType = actionDescriptor?.MethodInfo.ReturnType;
            }
            else if (filterContext.ActionDescriptor is TaskAsyncActionDescriptor)
            {
                var taskAsyncActionDescriptor = filterContext.ActionDescriptor as TaskAsyncActionDescriptor;
                actionReturnType = taskAsyncActionDescriptor?.MethodInfo.ReturnType;
            }

            base.OnAuthorization(filterContext);
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var actionDescriptor = filterContext.ActionDescriptor as ReflectedActionDescriptor;
            actionReturnType = actionDescriptor?.MethodInfo.ReturnType;

            base.OnActionExecuting(filterContext);
        }
        protected JsonResult Json(object data, JsonRequestBehavior behavior, bool ignoreNullValues)
        {
            if (ignoreNullValues)
            {
                return new JsonIgnoreNullResult
                {
                    Data = data,
                    ContentType = null,
                    ContentEncoding = null,
                    JsonRequestBehavior = behavior
                };
            }
            else
            {
                return this.Json(data, contentType: null, contentEncoding: null, behavior: behavior);
            }
        }
        #endregion

        #region Public Methods        
        public bool IsReturnTypeOf(Type type)
        {
            return actionReturnType != null && type.IsAssignableFrom(actionReturnType);
        }

        public IHtmlString RenderView(string viewName, object model)
        {
            ViewData.Model = model;
            using (var sw = new System.IO.StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(ControllerContext, viewName);
                if (viewResult == null || viewResult.View == null)
                    throw new Exception($"View '{viewName}' not found.");

                var viewContext = new ViewContext(ControllerContext, viewResult.View, ViewData, TempData, sw);
                viewResult.View.Render(viewContext, sw);
                viewResult.ViewEngine.ReleaseView(ControllerContext, viewResult.View);
                return new HtmlString(sw.ToString());
            }
        }
        #endregion
    }
}