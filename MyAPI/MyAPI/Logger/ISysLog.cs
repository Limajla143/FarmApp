
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface ISysLog
    {
        void Performance(string strMessage, double timeSpan, params object[] objs);
        void Exception(string strMessage, params object[] objs);
        void Debug(string strMessage, params object[] objs);
        void Server(string strMessage, params object[] objs);

        //void Performance(TimeSpan ts, string strMessage);
        //void Exception(Exception ex);
    }
}
