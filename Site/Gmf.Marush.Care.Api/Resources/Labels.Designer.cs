﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Gmf.Marush.Care.Api.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "17.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class Labels {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Labels() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Gmf.Marush.Care.Api.Resources.Labels", typeof(Labels).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Vreme trajanje tretmana može biti od 15 do 240 minuta.
        /// </summary>
        public static string ValidationDuration {
            get {
                return ResourceManager.GetString("ValidationDuration", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Neispravna mejl adresa.
        /// </summary>
        public static string ValidationEmail {
            get {
                return ResourceManager.GetString("ValidationEmail", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Neodgovarajući datum i(li) vreme tretmana.
        /// </summary>
        public static string ValidationInterval {
            get {
                return ResourceManager.GetString("ValidationInterval", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Uneta vrednost je predugačka.
        /// </summary>
        public static string ValidationLength {
            get {
                return ResourceManager.GetString("ValidationLength", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Ovo je obavezno polje.
        /// </summary>
        public static string ValidationRequired {
            get {
                return ResourceManager.GetString("ValidationRequired", resourceCulture);
            }
        }
    }
}