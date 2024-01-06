using Core.Interfaces;
using log4net;
using MyAPI.Logger;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

[assembly: log4net.Config.XmlConfigurator(ConfigFile = "log4net.config", Watch = true)]
namespace MyAPI.Logger
{
    public sealed class SysLog : ISysLog
    {
        #region  FIELDS : CONSTANT >>>>>>>>>>>>>>>>>>>>>>>>>> (6)

        private const string PERFORMANCE = "[PERFORMANCE]";
        private const string EXCEPTION = "[EXCEPTION]";
        private const string DEBUG = "[DEBUG]";
        private const string SERVER = "[SERVER]";
        private const string ERROR = "[ERROR]";
        private const string NOCLASSNAME = "[NO-CLASS]";
        private const string DBPERFORMANCE = "[DBPERFORMANCE]";
        private static readonly TimeSpan fastBound = new TimeSpan(0, 0, 1);

        public enum LoggerType
        {
            PERFORMANCE = 1,
            EXCEPTION = 2,
            DEBUG = 3,
            SERVER = 4,
            ERROR = 5,
            DBPERFORMANCE = 6
        };

        private static SysLog newLogger = null;

        private ILog logger;
        #endregion

        /**
                   * Create a logger with assembly type.  Result in logging based
                   * on assembly's fully qualified name.
                   * Example: WARN 10 Cwb.Common.Logs.SysLog 
                   */
        private SysLog(Type type)
        {
            logger = LogManager.GetLogger(type);
        }

        /**
            * Create a logger with an assigned name.  Result in logging based
            * on assembly's fully qualified name.
            * Example: WARN 10 myclass
            * Will default to EMPTY is is null
            */
        private SysLog(String strType)
        {
            if (String.IsNullOrEmpty(strType))
                strType = NOCLASSNAME;
            logger = LogManager.GetLogger(strType);
        }

        #region  METHODS : PUBLIC >>>>>>>>>>>>>>>>>>>>>>>>>>> (2)

        /// <summary>
        /// This will be specific to each logging framework.  Need to change if logging
        /// framework is changed.  To switch to Microsoft Logging Framework (1) change the
        /// way the logger instance is invoke here.
        /// (2) replace the logging interface implementation. 
        /// Please see EntLog.cs.
        /// </summary>
        /// 
        public SysLog()
        {
            // Initialize your logger as needed
            logger = LogManager.GetLogger(typeof(SysLog));
        }
        public static ISysLog GetLogger(Type type)
        {
            if (null == newLogger)
                return (ISysLog)new SysLog(type);
            return newLogger;
        }

        public static ISysLog GetLogger(string strType)
        {
            if (null == newLogger)
                return (ISysLog)new SysLog(strType);
            return newLogger;
        }

        #endregion


        public void Debug(string strMessage, params object[] objs)
        {
            if (String.IsNullOrEmpty(strMessage) || !logger.IsDebugEnabled)
                return;
            string strMessageResult = mergeStrParas(strMessage, objs);
            logger.Debug(LoggerHelper.Debug(DEBUG, String.Format(" {0}", strMessageResult)));
        }

        public void Exception(string strMessage, params object[] objs)
        {
            if (String.IsNullOrEmpty(strMessage) || !logger.IsErrorEnabled)
                return;
            string strMessageResult = mergeStrParas(strMessage, objs);

            //logger.Warn(String.Format("{0}{1}", EXCEPTION, strMessageResult));
            logger.Warn(LoggerHelper.Error(EXCEPTION, null, strMessageResult.ToString()));
        }

        public void Exception(Exception ex)
        {
            if (ex != null)
            {
                LogException(ex, 0);
            }
        }

        public void Performance(string strMessage, double timeSpan, params object[] objs)
        {
            if (String.IsNullOrEmpty(strMessage) || !logger.IsInfoEnabled)
                return;
            string strMessageResult = mergeStrParas(strMessage, objs);

            logger.Info(LoggerHelper.Performance(PERFORMANCE, strMessageResult, timeSpan));
        }

        public void Server(string strMessage, params object[] objs)
        {
            if (String.IsNullOrEmpty(strMessage) || !logger.IsInfoEnabled)
                return;
            string strMessageResult = mergeStrParas(strMessage, objs);
            logger.Info(LoggerHelper.Server(SERVER, String.Format(" {0}", strMessageResult)));
        }

        private void LogException(Exception ex, int innerLoop)
        {
            if (ex != null)
            {
                StringBuilder builder = new StringBuilder();
                builder.Append(EXCEPTION);
                builder.AppendLine(string.Concat("Inner exception number - ", innerLoop));
                builder.AppendLine(ex.Message);
                builder.AppendLine(ex.StackTrace);
                innerLoop++;
                if (ex.InnerException != null)
                {
                    logger.Error(builder.ToString());
                    LogException(ex.InnerException, innerLoop);
                }
                else
                {
                    builder.AppendLine("Main exception & its inner exception Log end");
                    logger.Error(LoggerHelper.Error(ERROR, ex, builder.ToString()));
                }
                LogHelper.Exception(ex);
            }
        }

        private string GetLogErrorMsg(Exception ex, int innerLoop)   //CWB-515 modified
        {
            StringBuilder builder = new StringBuilder();
            if (ex != null)
            {
                builder.Append(EXCEPTION);
                builder.AppendLine(string.Concat("Inner exception number - ", innerLoop));
                builder.AppendLine(ex.Message);
                builder.AppendLine(ex.StackTrace);
                innerLoop++;
                if (ex.InnerException != null)
                {
                    logger.Warn(LoggerHelper.Error(ERROR, ex, builder.ToString()));
                    GetLogErrorMsg(ex.InnerException, innerLoop);
                }
                else
                {
                    builder.AppendLine("Main exception & its inner exception Log end");
                }
            }
            return builder.ToString();
        }

        string mergeStrParas(string strMessage, params object[] objs)
        {
            string strMessageResult = strMessage;
            if (objs != null && objs.Length > 0)
            {
                strMessageResult = string.Format(strMessage, objs);
            }
            return strMessageResult;
        }

        //public void Performance(TimeSpan ts, string strMessage)
        //{
        //    if (String.IsNullOrEmpty(strMessage) || !logger.IsInfoEnabled)
        //        return;
        //    double timeSpan = ts.TotalMilliseconds;
        //    string performance = GetSpeedName(timeSpan);

        //    logger.Info(string.Format("{0}{1} ,Request Time:[{2}]{3}", PERFORMANCE, strMessage, ts, performance));
        //}

        //private static string GetSpeedName(double time)
        //{
        //    return (time > 5000 && time <= 10000 ? "[SLOW]" : (time > 10000 ? "[VERYSLOW]" : string.Empty));
        //}
    }
}
