using log4net;

namespace MyAPI.Logger
{
    public static class LogHelper
    {
        private static readonly TimeSpan fastBound = new TimeSpan(0, 0, 1);

        static LogHelper()
        {
            Server = LogManager.GetLogger("Server");
            Performance = LogManager.GetLogger("Performance");
            ExceptionLog = LogManager.GetLogger("Exception");
        }

        ////OFF > FATAL > ERROR > WARN > INFO > DEBUG > ALL 
        public static ILog Performance { get; private set; }
        public static ILog Server { get; private set; }
        public static ILog ExceptionLog { get; private set; }

        public static void InitializeConfiguration(string configFolder)
        {
            log4net.GlobalContext.Properties["host"] = ((string[])AppDomain.CurrentDomain.FriendlyName.Split(':')).FirstOrDefault();
            log4net.Config.XmlConfigurator.ConfigureAndWatch(new FileInfo(Path.Combine(configFolder, "log4net.config")));
        }

        public static ILog GetLogger(string loggerName)
        {
            return LogManager.GetLogger(loggerName);
        }

        #region Performance
        public static void RequestPerformance(TimeSpan timeCost, string logInfo)
        {
            if (timeCost >= fastBound)
            {
                //Performance.Warn(string.Format("[TRS5LAPINTERNALAPI-PERFORMANCE]{0}[{1}ms]", logInfo, Math.Round(timeCost.TotalMilliseconds)));
                Performance.Warn(LoggerHelper.Performance("[PERFORMANCE]", logInfo, Math.Round(timeCost.TotalMilliseconds)));
            }
            else
            {
                //Performance.Info(string.Format("[TRS5LAPINTERNALAPI-PERFORMANCE]{0}[{1}ms]", logInfo, Math.Round(timeCost.TotalMilliseconds)));
                Performance.Info(LoggerHelper.Performance("[PERFORMANCE]", logInfo, Math.Round(timeCost.TotalMilliseconds)));
            }
        }

        public static void Exception(System.Exception exception)
        {
            ExceptionLog.Error(exception.Message, exception);
        }
        public static TResult Execute<TResult>(Func<TResult> fun, string log)
        {
            DateTime start = DateTime.Now;
            TResult result;
            string exceptionMessage = null;

            try
            {
                result = fun();
            }
            catch (System.Exception ex)
            {
                exceptionMessage = ex.Message;
                throw;
            }
            finally
            {
                RequestPerformance(DateTime.Now - start, log + exceptionMessage);
            }

            return result;
        }

        /// <summary>
        /// User this method execute method, will log method performance
        /// </summary>
        /// <param name="function"></param>
        /// <param name="log"></param>
        public static void Execute(Action function, string log)
        {
            DateTime start = DateTime.Now;
            string exceptionMessage = null;

            try
            {
                function();
            }
            catch (System.Exception ex)
            {
                exceptionMessage = ex.Message;
                throw;
            }
            finally
            {
                RequestPerformance(DateTime.Now - start, log + exceptionMessage);
            }

            return;
        }

        #endregion
    }
}
