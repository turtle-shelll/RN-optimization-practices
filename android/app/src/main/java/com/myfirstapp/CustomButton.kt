package com.myfirstapp

import android.content.Context
import androidx.appcompat.widget.AppCompatButton
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter

class CustomButton(context: Context) : AppCompatButton(context) {

    init {
        // By default, make text uppercase and add padding
        isAllCaps = true
        setPadding(30, 30, 30, 30)

        // Native Click Listener
        setOnClickListener {
            val reactContext = context as ReactContext
            val event = Arguments.createMap()
            event.putString("message", "Hello from Native Android!")
            
            // Send event across the bridge
            reactContext.getJSModule(RCTEventEmitter::class.java).receiveEvent(
                id,
                "onCustomClick",
                event
            )
        }
    }
}
