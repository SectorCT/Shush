import React from 'react'

const People = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TopBar />
        {/* rest of your app's content */}
      </View>
    </SafeAreaView>
  )
}

export default People
