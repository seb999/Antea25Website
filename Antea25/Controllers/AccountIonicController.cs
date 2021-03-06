using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Antea25.Models;
using Antea25.Models.AccountViewModels;
using Antea25.Services;
using Antea25.Data;
using Microsoft.EntityFrameworkCore;

namespace Antea25.Controllers
{
    [Authorize]
    [Route("[controller]/[action]")]
    public class AccountIonicController : Controller
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ILogger _logger;
        private readonly ApplicationDbContext DbContext;

        public AccountIonicController(
            [FromServices] ApplicationDbContext appDbContext,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ILogger<AccountController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _logger = logger;
            DbContext = appDbContext;
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("/api/[controller]/Login")]
        public async Task<LoginViewModel> Login([FromBody]LoginViewModel model, string returnUrl = null)
        {
           Console.WriteLine("Reach API for");
            ViewData["ReturnUrl"] = returnUrl;
            if (ModelState.IsValid)
            {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    _logger.LogInformation("User logged in.");
                    model.Result = "passed";
                    return model;
                }
                else
                {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                    model.Result = "Invalid login attempt.";
                    return model;
                }
            }

            // If we got this far, something failed, redisplay form
            model.Result = "Invalid login attempt.";
            return model;
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("/api/[controller]/GetUserId/{userEmail}")]
        public async Task<LoginViewModel> GetUserId(string userEmail){
            var result =  await DbContext.Users.Where(p=>p.Email == userEmail).Select(p=>p.Id).FirstOrDefaultAsync();
              return new LoginViewModel(){ UserId = result};
        }
    }
}