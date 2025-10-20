package com.itule.development
import com.facebook.react.common.assets.ReactFontManager

import android.app.Application
import android.content.res.Configuration

import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactHost
import com.facebook.react.common.ReleaseLevel
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactNativeHost

import expo.modules.ApplicationLifecycleDispatcher
import expo.modules.ReactNativeHostWrapper

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost = ReactNativeHostWrapper(
      this,
      object : DefaultReactNativeHost(this) {
        /**
             * Provides the list of React packages used by the application.
             *
             * The list contains packages discovered by autolinking; it is the mutable list returned by
             * PackageList(this).packages and can be modified here to add packages that cannot be autolinked.
             *
             * @return The mutable list of `ReactPackage` instances used by the app.
             */
            override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // Packages that cannot be autolinked yet can be added manually here, for example:
              // add(MyReactNativePackage())
            }

          /**
 * Specifies the Metro entry module path used by the React Native host.
 *
 * @return The JS main module name ".expo/.virtual-metro-entry".
 */
override fun getJSMainModuleName(): String = ".expo/.virtual-metro-entry"

          /**
 * Indicates whether developer-support features should be enabled.
 *
 * @return `true` if developer support is enabled (debug build), `false` otherwise.
 */
override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

          override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
      }
  )

  override val reactHost: ReactHost
    get() = ReactNativeHostWrapper.createReactHost(applicationContext, reactNativeHost)

  /**
   * Initializes the application, configures the new-architecture release level, and starts React Native.
   *
   * Sets DefaultNewArchitectureEntryPoint.releaseLevel from the `BuildConfig.REACT_NATIVE_RELEASE_LEVEL` value,
   * falling back to `ReleaseLevel.STABLE` if the configured value is invalid. Then initializes the React Native
   * runtime and notifies the Expo application lifecycle dispatcher of application creation.
   */
  override fun onCreate() {
    super.onCreate()
    // @generated begin xml-fonts-init - expo prebuild (DO NOT MODIFY) sync-da39a3ee5e6b4b0d3255bfef95601890afd80709

    // @generated end xml-fonts-init
    DefaultNewArchitectureEntryPoint.releaseLevel = try {
      ReleaseLevel.valueOf(BuildConfig.REACT_NATIVE_RELEASE_LEVEL.uppercase())
    } catch (e: IllegalArgumentException) {
      ReleaseLevel.STABLE
    }
    loadReactNative(this)
    ApplicationLifecycleDispatcher.onApplicationCreate(this)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig)
  }
}