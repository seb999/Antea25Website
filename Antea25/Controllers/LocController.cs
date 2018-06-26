using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Antea25.Data;
using Antea25.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Antea25.Controllers
{
    public class LocController : Controller
    {
        private readonly ApplicationDbContext DbContext;

        public LocController([FromServices] ApplicationDbContext appDbContext)
        {
            DbContext = appDbContext;
            //var userId = User.Claims.FirstOrDefault().Value;
        }

        // GET: Localisation
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                return View();
            }
            return RedirectToAction("Login", "Account");
        }

         ///If called by App, we need to pass the userId as argument
        [HttpGet]
        [Route("/api/[controller]/GetGpsData/{userId}")]
        public List<GpsPosition> GetGpsData(string userId)
        {
            if (User.Identity.IsAuthenticated)
            {
                // return DbContext.GpsPosition.Where(p => p.UserId == User.Claims.FirstOrDefault().Value).OrderByDescending(p=>p.GpsPositionDate).ToList();
                return DbContext.GpsPosition.Where(p => p.Device.UserId == User.Claims.FirstOrDefault().Value).OrderByDescending(p=>p.GpsPositionDate).ToList();
            }
            else
            {
                if(userId!=null)
                {
                    return DbContext.GpsPosition.Where(p => p.Device.UserId == User.Claims.FirstOrDefault().Value).OrderByDescending(p=>p.GpsPositionDate).ToList();
                }
            }
            return null;
        }

        ///Check if sensor is moving for APP
        /// usage example : host/api/Loc/IsSensorMoving/a17767b1-820f-4f0b-948b-acd9cd1a242a/2016-12-01T00:00:00
        [HttpGet]
        [Route("/api/[controller]/GetMotion/{userId}/{fromThisDate}")]
        public bool GetMotion(string userId, DateTime fromThisDate)
        {
            if(DbContext.Users.Where(p=>p.Id == userId).FirstOrDefault()==null)
                return false;
            
            if (DbContext.GpsPosition.Where(p=>p.UserId==userId && DateTime.Compare(p.GpsPositionDate, fromThisDate) >0).Count() >0)
            return true;
            else
            return false;
        }

        ///Called by The Internet network
        ///Transfer position of device to db
        /// usage example : host/api/Loc/SaveData (use postman to simulate)
        [HttpPost]
        [Route("/api/[controller]/SaveData")]
        public string SaveData([FromBody]JObject rawPayLoad){
            RawPayLoad loraData = JsonConvert.DeserializeObject<RawPayLoad>(rawPayLoad.ToString());

            int deviceId = DbContext.Device.Where(p => p.DeviceEUI == loraData.Hardware_serial).Select(p => p.DeviceId).FirstOrDefault();

            GpsPosition GpsData = new GpsPosition()
            {
                //UserId = "a17767b1-820f-4f0b-948b-acd9cd1a242a",
                //DeviceId = loraData.Dev_Id,
                DeviceId = deviceId,
                GpsPositionLatitude = DegreeToDecimal(loraData.Payload_fields.Latitude,loraData.Payload_fields.LatitudeDecimal),
                GpsPositionLongitude = DegreeToDecimal(loraData.Payload_fields.Longitude,loraData.Payload_fields.LongitudeDecimal),
                GpsPositionDate = loraData.Metadata.Time,

                //For debugging
                GpsPositionLatitudeRaw = string.Format("{0}.{1}",loraData.Payload_fields.Latitude,loraData.Payload_fields.LatitudeDecimal),
                GpsPositionLongitudeRaw = string.Format("{0}.{1}",loraData.Payload_fields.Longitude,loraData.Payload_fields.LongitudeDecimal)
            };
            DbContext.Add(GpsData);
            DbContext.SaveChanges();
            return "Saved";
        }

        // public float DegreeToDecimal(int DegreeMinute, int decimalMinute)
        // {
        //     int degree = DegreeMinute/100;
        //     float minute = (float)(DegreeMinute % 100)+ (float)decimalMinute/100000;
        //     float minuteDecimal = minute/60;
        //     float toto = degree + minuteDecimal;
        //     return degree + minuteDecimal;
        // }

        public float DegreeToDecimal(int degreeMinute, int decimalMinute)
        {
            //Calculation ex: 5919.12925 -> 59 + 19.12925/60
            int degree = degreeMinute/100;
            float minute = ((float)(degreeMinute % 100) + (float)(decimalMinute)/100000)/60;
            return degree + minute;
        }
      
        // POST: Localisation/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

    }
}