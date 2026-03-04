# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# ============================================================================
# REACT NATIVE SPECIFIC PROGUARD RULES
# ============================================================================

# Keep React Native - do not obfuscate native method names
-keep public class com.facebook.react.** {
    public <fields>;
    public <methods>;
}

-keep public class com.facebook.react.bridge.** {
    public *;
}

-keep public class com.facebook.react.shell.** {
    public *;
}

-keep class com.facebook.react.ReactPackage { *; }
-keep class com.facebook.react.ReactInstanceManager { *; }
-keep class com.facebook.react.ReactApplication { *; }
-keep class com.facebook.react.ReactActivity { *; }
-keep class com.facebook.react.ReactActivityDelegate { *; }

# ============================================================================
# FIREBASE SPECIFIC PROGUARD RULES
# ============================================================================

-keep class com.google.firebase.** { *; }
-keep interface com.google.firebase.** { *; }
-keep public class * extends com.google.firebase.** { *; }
-keepnames public class * extends com.google.firebase.**

# Firebase Core
-keep class com.google.firebase.installations.** { *; }
-keep interface com.google.firebase.installations.** { *; }

# Firebase Auth
-keep class com.google.firebase.auth.** { *; }
-keep interface com.google.firebase.auth.** { *; }

# Firebase Messaging
-keep class com.google.firebase.messaging.** { *; }
-keep interface com.google.firebase.messaging.** { *; }

# Firebase Realtime Database
-keep class com.google.firebase.database.** { *; }
-keep interface com.google.firebase.database.** { *; }

# ============================================================================
# ANDROIDX PROGUARD RULES
# ============================================================================

-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# ============================================================================
# GENERAL ANDROID PROGUARD RULES
# ============================================================================

# View constructors are called using reflection
-keepclasseswithmembernames class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}

# Keep enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep serializable classes and fields
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep BuildConfig
-keep class **.BuildConfig { *; }

# Keep R resources
-keepclassmembers class **.R$* {
    public static <fields>;
}

# ============================================================================
# LOGGING - REMOVE DEBUG LOGS IN PRODUCTION
# ============================================================================

-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
    public static *** w(...);
    public static *** e(...);
}

# ============================================================================
# KOTLIN SPECIFIC RULES
# ============================================================================

-keepclasseswithmembers class * {
    public <init>();
}

-keep class kotlin.** { *; }
-keep interface kotlin.** { *; }