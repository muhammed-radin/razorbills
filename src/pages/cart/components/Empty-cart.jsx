import React from 'react'

export default function 
() {
  return (
    
         <Card className="text-center py-16">
            <CardContent>
              <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t("cart.emptyCartTitle")}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t("cart.emptyCartDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/search">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {t("cart.startShopping")}
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/wishlist">
                    <Heart className="w-4 h-4 mr-2" />
                    {t("cart.viewWishlist")}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
   
  )
}
