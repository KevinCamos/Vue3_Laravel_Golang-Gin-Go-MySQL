package users

import (
	"fmt"
	"net/http"
	"starbars/config"
	"starbars/common"
	"github.com/gin-gonic/gin"
	"errors"
)

func UserRegister(c *gin.Context) {
	userModelValidator := NewUserModelValidator()
	if err := userModelValidator.Bind(c); err != nil {
		c.JSON(http.StatusUnprocessableEntity,gin.H{
			"error": "400"})
		return
	}


	err := CheckFindOneUser(&UserModel{Email: userModelValidator.userModel.Email})
	if err == nil {
		c.JSON(http.StatusForbidden, common.NewError("Registrer", errors.New("Este usuario ya se encuentra registrado")))
		return
	}


	if err := SaveOne(&userModelValidator.userModel); err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	}
	fmt.Println( " Guardat?")
	c.Set("my_user_model", userModelValidator.userModel)
	serializer := RegisterSerializer{c}
	c.JSON(http.StatusCreated, serializer.Response())

}


func CheckAdmin(c *gin.Context) {
		CheckInLaravel(c)
	}

func GetAllUsers(c *gin.Context) {
	var user []UserModel

	if err := config.DB.Find(&user).Error; err != nil {
		fmt.Println("entra", "error")
		c.AbortWithStatus(http.StatusNotFound)
	} 
		fmt.Println("entra", user)
	serializer := UsersSerializer{c, user}
	// console.log(serializer.Response())
	c.JSON(http.StatusCreated, serializer.Response())
}
func GetUserByID(c *gin.Context) {
	id := c.Params.ByName("id")
	var user UserModel
	if err := config.DB.Where("id = ?", id).First(&user).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	}

	c.Set("my_user_model", user)
	// serializer := RegisterSerializer{c}
	serializer := UserSerializer{c}
	c.JSON(http.StatusCreated, serializer.Response())

}
func UpdateUser(c *gin.Context) {
	id := c.Params.ByName("id")
	fmt.Println("id", id)

	var user UserModel
	if err := config.DB.Where("id = ?", id).First(&user).Error; err != nil {
		fmt.Println("errorput1", "errorput1")

		c.AbortWithStatus(http.StatusNotFound)
	}
	// c.BindJSON(&user)
	c.Set("my_user_model", user)
	serializer := UserSerializer{c}
	c.JSON(http.StatusCreated, serializer.Response())
	
	// c.JSON(http.StatusOK, user)

	if err := config.DB.Save(&user);	 err != nil {
		fmt.Println("errorput2", "errorput2")

		 c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, user)
	}
}
func DeleteUser(c *gin.Context) {
	var user UserModel
	id := c.Params.ByName("id")
	if err :=config.DB.Where("id = ?", id).Delete(user).Error; err != nil {
		c.AbortWithStatus(http.StatusNotFound)
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status":  gin.H{
			"id: ": id,
			"status": "Eliminado con éxito",
			},
			"code":http.StatusOK,
			})
		}
}

func UserLogin(c *gin.Context) {


	loginValidator := NewLoginValidator()
	if err := loginValidator.Bind(c); err != nil {
		c.JSON(http.StatusUnprocessableEntity, err)
		return
	}
	
	// fmt.Println(loginValidator.Email, loginValidator.userModel, loginValidator)
	userModel, err := FindOneUser(&UserModel{Email: loginValidator.userModel.Email})

	if err != nil {
		c.JSON(http.StatusForbidden, common.NewError("login", errors.New("Not Registered email ")))
		return
	}

	if userModel.checkPassword(loginValidator.Password) != nil {
		c.JSON(http.StatusForbidden,common.NewError("login", errors.New(" invalid password")))
		return
	}

	c.Set("my_user_model", userModel)
	CheckInLaravel(c)
	}

	  
/* 	func prueba(c *gin.Context) {
	
	var count1 int64
	var count2 int64
	var count3 int64

	config.DB.Table("order").Where("status = ?", "canceled").Count(&count1)
	config.DB.Table("order").Where("status = ?", "F").Count(&count2)
	config.DB.Table("order").Count(&count3)

	c.JSON(http.StatusCreated,  gin.H{
		"canceled": count1,
		"Ending": count2,
		"Total":count3 , 
		})
	}
	 */
