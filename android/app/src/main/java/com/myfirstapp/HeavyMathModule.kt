package com.myfirstapp

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import kotlin.concurrent.thread
import kotlin.math.abs
import kotlin.math.cos
import kotlin.math.sin

class HeavyMathModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "HeavyMathModule"
    }

    @ReactMethod
    fun generateData(promise: Promise) {
        // Spawn a background thread to prevent blocking the JS or Main UI thread
        thread(start = true) {
            try {
                val itemsArray: WritableArray = Arguments.createArray()
                val colors = arrayOf("#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899")

                // Massive mathematical loop equivalent to the JS one
                for (i in 0 until 1000) {
                    var acc = 0.0
                    for (j in 0 until 200) {
                        acc += sin((i + j).toDouble()) * cos(j.toDouble())
                    }
                    
                    val itemMap: WritableMap = Arguments.createMap()
                    itemMap.putInt("id", i + 1)
                    itemMap.putInt("userId", (i / 10) + 1)
                    itemMap.putString("title", "Native Computed Post ${i + 1}")
                    
                    // Formatting the double to match JavaScript's .toFixed(1)
                    val formattedAcc = String.format("%.1f", abs(acc))
                    itemMap.putString("body", "This post's heavy logic was processed completely on a background Kotlin thread! Value: $formattedAcc")
                    
                    itemsArray.pushMap(itemMap)
                }

                // Simulate slight network delay to show off Suspense clearly
                Thread.sleep(1500)

                // Resolve the Promise with the data
                promise.resolve(itemsArray)
            } catch (e: Exception) {
                promise.reject("HeavyMathError", e)
            }
        }
    }
}
