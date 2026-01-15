package com.prayerapp

import android.os.Bundle // Required
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
// You can remove the RNScreensFragmentFactory import if you use the null approach below

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    // PASSING null instead of savedInstanceState is the standard fix 
    // for React Navigation stability on Android.
    super.onCreate(null)
  }

  override fun getMainComponentName(): String = "prayerapp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}