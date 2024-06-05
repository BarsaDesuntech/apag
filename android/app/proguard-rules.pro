# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep class de.apag.apagapp.BuildConfig { *; }
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface com.facebook.common.internal.DoNotStrip
-keep class com.facebook.** {*;}
# Do not strip any method/class that is annotated with @DoNotStrip
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keep @com.facebook.common.internal.DoNotStrip class *
-keepclassmembers class * {
    @com.facebook.proguard.annotations.DoNotStrip *;
    @com.facebook.common.internal.DoNotStrip *;
}
-keep public class com.google.android.gms.* { public *; }
-dontwarn com.google.android.gms.**


-keepclassmembers @com.facebook.proguard.annotations.KeepGettersAndSetters class * {
  void set*(***);
  *** get*();
}

-keep class * implements com.facebook.react.bridge.JavaScriptModule { *; }
-keep class * implements com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers,includedescriptorclasses class * { native <methods>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.** <fields>; }
-keepclassmembers class *  { @com.facebook.react.uimanager.** <methods>; }
-keepclassmembers class *  { @com.facebook.react.views.** <methods>; }
-keepclassmembers class *  { @com.facebook.react.views.** <fields>; }
-keep class com.facebook.datasource.** {*;}
-keep class com.facebook.drawee.interfaces.** {*;}
-keep class com.facebook.common.internal.** {*;}
-keep class com.facebook.imagepipeline.** {*;}
#-keep class com.facebook.imagepipeline.request.** {*;}
#-keep class com.facebook.imagepipeline.bitmaps.** {*;}
#-keep class com.facebook.imagepipeline.listener.** {*;}
#-keep class com.facebook.imagepipeline.common.** {*;}
#-keep class com.facebook.imagepipeline.decoder.** {*;}
#-keep class com.facebook.imagepipeline.image.** {*;}
-dontnote com.facebook.react.**

# TextLayoutBuilder uses a non-public Android constructor within StaticLayout.
# See libs/proxy/src/main/java/com/facebook/fbui/textlayoutbuilder/proxy for details.
-dontnote android.text.StaticLayout

# okhttp

-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontnote okhttp3.**

# okio

-keep class sun.misc.Unsafe { *; }
-keep public class okio.** {*;}
-dontnote java.nio.file.*
-dontnote org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement
-dontnote okio.**


-keep public class com.airbnb.android.** {*;}
-keep class com.horcrux.svg.** {*;}

-keep class org.apache.http.** { *; }
-keep class com.google.**
-keep class sun.misc.**
-dontnote sun.misc.**
-dontnote com.google.**
-dontnote org.apache.http.**
-dontnote android.net.**

-keep class bolts.** {*;}

#-keep public class com.google.android.gms.maps.GoogleMap.** {*;}
#-keep public class com.facebook.react.** {*;}
#-keep public class okio.** {*;}

-keep class com.tonyodev.fetch2.** {*;}
-keep class kotlin.jvm.internal.** {*;}
-keep class kotlin.reflect.** {*;}
-keep class kotlin.jvm.functions.** {*;}
-dontnote kotlin.internal.PlatformImplementationsKt
-dontnote kotlin.reflect.jvm.internal.**
-keep class android.arch.persistence.** {*;}