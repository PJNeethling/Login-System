using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;

namespace Login.Web.Helpers
{
    public static class AppExtensions
    {
        static DateTime DateEmpty = new DateTime(1900, 1, 1);

        #region Static Properties
        #endregion

        #region Public Static Methods       

        public static IHtmlString DisplayForBoolean(this HtmlHelper helper, bool? value)
        {
            return MvcHtmlString.Create(value == null ? "" : value.Value ? "Yes" : "No");
        }
        public static IHtmlString DisplayForDate(this HtmlHelper helper, DateTime? value)
        {
            return MvcHtmlString.Create(value == null || value.Value <= DateEmpty ? "" : $"{value:yyyy-MM-dd}");
        }

        public static bool IsNullOrEmpty(this HtmlHelper helper, Object value)
        {
            if (value == null)
                return true;
            if (value.GetType() == typeof(string))
                return string.IsNullOrEmpty(value.ToString());
            if (value.GetType() == typeof(DateTime))
                return (DateTime)value <= DateEmpty;

            return false;
        }
        #endregion

        #region Private Static Methods
        public static string StripHTML(string input)
        {
            return System.Text.RegularExpressions.Regex.Replace(input, "(?i)<(?!img|/img).*?>", String.Empty);
        }
        #endregion
    }

    public static class Regex
    {
        public const string EmailAddress = "^((?>[a-zA-Z\\d!#$%&'*+\\-/=?^_`{|}~]+\\x20*|\"((?=[\\x01-\\x7f])[^\"\\\\]|\\\\[\\x01-\\x7f])*\"\\x20*)*(?<angle><))?((?!\\.)(?>\\.?[a-zA-Z\\d!#$%&'*+\\-/=?^_`{|}~]+)+|\"((?=[\\x01-\\x7f])[^\"\\\\]|\\\\[\\x01-\\x7f])*\")@(((?!-)[a-zA-Z\\d\\-]+(?<!-)\\.)+[a-zA-Z]{2,}|\\[(((?(?<!\\[)\\.)(25[0-5]|2[0-4]\\d|[01]?\\d?\\d)){4}|[a-zA-Z\\d\\-]*[a-zA-Z\\d]:((?=[\\x01-\\x7f])[^\\\\\\[\\]]|\\\\[\\x01-\\x7f])+)\\])(?(angle)>)$";
        public const string MobileNumber = "(?'Loc1'^0\\d{2}\\d{3}\\d{4}$)|(?'Int1'^\\+27\\d{2}\\d{3}\\d{4}$)|(?'Loc2'^[0]{1}\\d{2}\\s\\d{3}\\s\\d{4}$)|(?'Int2'^\\+27\\s\\d{2}\\s\\d{3}\\s\\d{4}$)|(?'Loc3'^0\\d{2}-\\d{3}-\\d{4}$)|(?'Int3'^\\+27{1}-\\d{2}-\\d{3}-\\d{4}$)";
    }
}
