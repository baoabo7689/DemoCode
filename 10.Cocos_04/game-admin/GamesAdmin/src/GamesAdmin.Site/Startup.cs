using System.Reflection;
using AutoMapper;
using GamesAdmin.Site._Shared;
using GamesAdmin.Site._Shared.Configurations;
using GamesAdmin.Site._Shared.Middlewares;
using GamesAdmin.Site.Features.GameRoundResult;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace GamesAdmin.Site
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddAutoMapper(typeof(Startup));
            
            var appSettings = new AppSettings(Configuration);
            services.AddSingleton<IAppSettings>(appSettings);

            services.AddSettings(Configuration);

            services.AddServices(appSettings);
            services.AddAuthentication(Configuration);
            services.AddHealthChecks();
            services.AddAuthorization(options =>
            {
                options.AddPolicy("admin",
                     policy => policy.RequireRole("admin"));
            });

            services.AddMvc(o => o.Conventions.Add(new FeatureConvention()))
                  .AddRazorOptions(options =>
                  {
                      // {0} - Action Name
                      // {1} - Controller Name
                      // {2} - Area Name
                      // {3} - Feature Name
                      // Replace normal view location entirely
                      options.ViewLocationFormats.Clear();
                      options.ViewLocationFormats.Add("/Features/{3}/{1}/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/{3}/Views/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/{3}/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/_Shared/{0}.cshtml");
                      options.ViewLocationFormats.Add("/Features/_Shared/Components/{0}.cshtml");
                      options.ViewLocationExpanders.Add(new FeatureViewLocationExpander());
                  });

            services.Configure<FormOptions>(options =>
            {
                options.ValueCountLimit = int.MaxValue;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=GameSettings}/{action=Index}");
                endpoints.MapHealthChecks("/health");
            });
        }
    }
}