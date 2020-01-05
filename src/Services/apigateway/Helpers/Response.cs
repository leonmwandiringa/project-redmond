using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_gateway.Helpers
{
    public class Response
    {
        public int status { get; set; }
        public string message { get; set; }
        public object data { get; set; } = null;
        public object error { get; set; } = null;
    }
}
