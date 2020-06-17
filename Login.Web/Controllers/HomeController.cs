using Login.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Login.Web.Controllers
{
    [Authorize]

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            LoginUserModel user = null;
#if DEBUG
            user = new LoginUserModel
            {
                UserName = "Admin",
                Password = "Password"
            };
#endif
            return View(user);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}