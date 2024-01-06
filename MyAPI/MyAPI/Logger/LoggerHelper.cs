using System.Diagnostics;
using System.Text;

namespace MyAPI.Logger
{
    public static class LoggerHelper
    {
        private static string _Guid;
        private static DateTime _StartDate;
        public static string GuidKey
        {
            get { return _Guid; }
            set { _Guid = value; }
        }

        public static DateTime StartDate
        {
            get { return _StartDate; }
            set { _StartDate = value; }
        }

        public static void Initialize()
        {
            _Guid = Guid.NewGuid().ToString();
            _StartDate = DateTime.Now;
        }
        public static string Performance(string tag, string strMessage, double costTime = 0)
        {
            try
            {
                if (_Guid == null)
                    Initialize();

                DateTime endTime = DateTime.Now;
                TimeSpan duration = endTime.Subtract(_StartDate);

                if (costTime < 0)
                    costTime = duration.TotalMilliseconds;

                string performance = GetSpeedName(costTime);

                string logMessage = string.Format("[MYFARMLOGS-PERFORMANCE][{0}]{6}[START:{1}][END:{2}][{3}ms]{4}{5}",
                       _Guid == null ? "NULL" : _Guid.ToString(),
                       _StartDate.ToString("yyyy-MM-dd hh:mm:ss"),
                       endTime.ToString("yyyy-MM-dd hh:mm:ss"),
                       Math.Round(costTime),
                       performance,
                       strMessage,
                       tag
                      );

                return logMessage;
            }
            catch (Exception ex)
            {
                return string.Format("ERROR FOUND ON LOGGER:{0}", ex.ToString());
            }
        }

        public static string Error(string tag, Exception ex, string msg)
        {
            try
            {
                if (_Guid == null)
                    Initialize();

                DateTime endTime = DateTime.Now;
                TimeSpan duration = endTime.Subtract(_StartDate);

                int line = 0;
                string errmsg = msg;
                string errfull = msg;

                if (ex != null)
                {
                    var st = new StackTrace(ex, true);
                    // Get the top stack frame
                    var frame = st.GetFrame(st.FrameCount - 1);
                    // Get the line number from the stack frame
                    try
                    {
                        line = frame.GetFileLineNumber();
                    }
                    catch { }

                    errmsg = ex.Message;
                    errfull = ex.ToString();
                }

                string logMessage = string.Format("[MYFARMLOGS-EXCEPTION][{0}]{7}[START:{1}][END:{2}][{3}ms][LINE:{4}][{5}][{6}]",
                       _Guid == null ? "NULL" : _Guid.ToString(),
                       _StartDate.ToString("yyyy-MM-dd hh:mm:ss"),
                       endTime.ToString("yyyy-MM-dd hh:mm:ss"),
                       Math.Round(duration.TotalMilliseconds),
                       line,
                       errmsg.Replace("\r\n", " ").Replace("\n", " ").Replace("\r", " "),
                       errfull.Replace("\r\n", " ").Replace("\n", " ").Replace("\r", " "),
                       tag
                      );

                return logMessage;
            }
            catch (Exception ex2)
            {
                return string.Format("ERROR FOUND ON LOGGER:{0}", ex2.ToString());
            }
        }

        public static string Debug(string tag, string strMessage)
        {
            try
            {
                if (_Guid == null)
                    Initialize();

                DateTime endTime = DateTime.Now;
                TimeSpan duration = endTime.Subtract(_StartDate);

                string logMessage = string.Format("[MYFARMLOGS-DEBUG][{0}]{5}[START:{1}][END:{2}][{3}ms]{4}",
                       _Guid == null ? "NULL" : _Guid.ToString(),
                       _StartDate.ToString("yyyy-MM-dd hh:mm:ss"),
                       endTime.ToString("yyyy-MM-dd hh:mm:ss"),
                       Math.Round(duration.TotalMilliseconds),
                       strMessage,
                       tag
                      );

                return logMessage;
            }
            catch (Exception ex)
            {
                return string.Format("ERROR FOUND ON LOGGER:{0}", ex.ToString());
            }
        }

        public static string Server(string tag, string strMessage)
        {
            try
            {
                if (_Guid == null)
                    Initialize();

                DateTime endTime = DateTime.Now;
                TimeSpan duration = endTime.Subtract(_StartDate);

                string logMessage = string.Format("[MYFARMLOGS-SERVER][{0}]{5}[START:{1}][END:{2}][{3}ms]{4}",
                       _Guid == null ? "NULL" : _Guid.ToString(),
                       _StartDate.ToString("yyyy-MM-dd hh:mm:ss"),
                       endTime.ToString("yyyy-MM-dd hh:mm:ss"),
                       Math.Round(duration.TotalMilliseconds),
                       strMessage,
                       tag
                      );

                return logMessage;
            }
            catch (Exception ex)
            {
                return string.Format("ERROR FOUND ON LOGGER:{0}", ex.ToString());
            }
        }

        public static string GetSpeedName(double time)
        {
            return (time > 5000 && time <= 10000 ? "[SLOW]" : (time > 10000 ? "[VERYSLOW]" : "[NORMAL]"));
        }
    }
}
